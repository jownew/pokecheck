import { Pokemon, PokemonApiResponse, LoadingState } from '@/types/pokemon';

const POKEMON_API_URL =
  'https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json';
const STORAGE_KEY = 'pokemon_data';
const STORAGE_TIMESTAMP_KEY = 'pokemon_data_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Clear cached Pokémon data from localStorage
 */
export const clearCache = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    console.log('Pokémon cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get localStorage usage information
 */
export const getStorageInfo = (): {
  used: number;
  available: number;
  percentage: number;
} => {
  if (typeof window === 'undefined')
    return { used: 0, available: 0, percentage: 0 };

  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Estimate available space (most browsers have 5-10MB limit)
    const estimated = 5 * 1024 * 1024; // 5MB estimate
    const percentage = (used / estimated) * 100;

    return {
      used: Math.round(used / 1024), // KB
      available: Math.round((estimated - used) / 1024), // KB
      percentage: Math.round(percentage),
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
};

/**
 * Check if cached data exists and is still valid
 */
export const isCacheValid = (): boolean => {
  if (typeof window === 'undefined') return false;

  const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const cacheTime = parseInt(timestamp, 10);
  const now = Date.now();

  return now - cacheTime < CACHE_DURATION;
};

/**
 * Get Pokémon data from localStorage
 */
export const getCachedPokemonData = (): Pokemon[] | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Check if cache is still valid
    if (!isCacheValid()) {
      clearCache();
      return null;
    }

    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);

    // Handle both compressed and full data formats
    return parsedData.map((pokemon: any) => ({
      ...pokemon,
      // Ensure proper structure for compressed data
      names: pokemon.names || { English: pokemon.name || 'Unknown' },
      primaryType: pokemon.primaryType?.names
        ? pokemon.primaryType
        : {
            names: {
              English:
                pokemon.primaryType?.names?.English ||
                pokemon.primaryType ||
                'Normal',
            },
          },
      secondaryType: pokemon.secondaryType?.names
        ? pokemon.secondaryType
        : pokemon.secondaryType
        ? { names: { English: pokemon.secondaryType } }
        : null,
      assets: pokemon.assets?.image
        ? pokemon.assets
        : pokemon.assets
        ? { image: pokemon.assets }
        : null,
      evolutions: pokemon.evolutions || [],
      moves: pokemon.moves || [],
    }));
  } catch (error) {
    console.error('Error parsing cached Pokémon data:', error);
    // Clear corrupted cache
    clearCache();
    return null;
  }
};

/**
 * Save Pokémon data to localStorage with quota management
 */
export const cachePokemonData = (data: Pokemon[]): void => {
  if (typeof window === 'undefined') return;

  try {
    // Create a compressed version of the data by removing unnecessary fields
    const compressedData = data.map((pokemon) => ({
      id: pokemon.id,
      formId: pokemon.formId,
      dexNr: pokemon.dexNr,
      generation: pokemon.generation,
      names: { English: pokemon.names.English }, // Only keep English name
      stats: pokemon.stats,
      primaryType: { names: { English: pokemon.primaryType.names.English } },
      secondaryType: pokemon.secondaryType
        ? { names: { English: pokemon.secondaryType.names.English } }
        : null,
      pokemonClass: pokemon.pokemonClass,
      assets: pokemon.assets ? { image: pokemon.assets.image } : null, // Only keep main image
      evolutions: pokemon.evolutions,
      hasMegaEvolution: pokemon.hasMegaEvolution,
    }));

    const dataString = JSON.stringify(compressedData);

    // Check if data size is reasonable (less than 4MB to be safe)
    const sizeInMB = new Blob([dataString]).size / (1024 * 1024);
    if (sizeInMB > 4) {
      console.warn(
        'Pokémon data is too large to cache efficiently:',
        sizeInMB.toFixed(2),
        'MB'
      );
      return;
    }

    localStorage.setItem(STORAGE_KEY, dataString);
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    console.log('Pokémon data cached successfully:', sizeInMB.toFixed(2), 'MB');
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn(
        'localStorage quota exceeded. Clearing old data and retrying...'
      );
      // Clear old data and try again with even more compressed data
      clearCache();
      try {
        // Ultra-compressed version - only essential data
        const ultraCompressed = data.map((pokemon) => ({
          id: pokemon.id,
          dexNr: pokemon.dexNr,
          names: { English: pokemon.names.English },
          stats: pokemon.stats,
          primaryType: {
            names: { English: pokemon.primaryType.names.English },
          },
          secondaryType: pokemon.secondaryType?.names.English || null,
          assets: pokemon.assets?.image || null,
          evolutions: pokemon.evolutions.map((evo) => ({
            id: evo.id,
            candies: evo.candies,
          })),
        }));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(ultraCompressed));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
        console.log('Pokémon data cached with ultra compression');
      } catch (retryError) {
        console.error('Failed to cache even compressed data:', retryError);
        // Don't throw error - app should work without caching
      }
    } else {
      console.error('Error caching Pokémon data:', error);
    }
  }
};

/**
 * Fetch Pokémon data from API
 */
export const fetchPokemonData = async (
  onProgress?: (progress: number) => void
): Promise<Pokemon[]> => {
  try {
    onProgress?.(10);

    const response = await fetch(POKEMON_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    onProgress?.(50);

    const data: PokemonApiResponse = await response.json();

    onProgress?.(80);

    // Sort by Pokédex number for consistent ordering
    const sortedData = data.sort((a, b) => a.dexNr - b.dexNr);

    onProgress?.(90);

    // Cache the data
    cachePokemonData(sortedData);

    onProgress?.(100);

    return sortedData;
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    throw error;
  }
};

/**
 * Get Pokémon data - from cache if valid, otherwise fetch from API
 */
export const getPokemonData = async (
  onProgress?: (progress: number) => void
): Promise<Pokemon[]> => {
  // Check if we have valid cached data
  if (isCacheValid()) {
    const cachedData = getCachedPokemonData();
    if (cachedData) {
      onProgress?.(100);
      return cachedData;
    }
  }

  // Fetch fresh data from API
  return fetchPokemonData(onProgress);
};

/**
 * Search Pokémon by name, type, or Pokédex number
 */
export const searchPokemon = (
  pokemonList: Pokemon[],
  searchTerm: string
): Pokemon[] => {
  if (!searchTerm.trim()) return pokemonList;

  const term = searchTerm.toLowerCase().trim();

  return pokemonList.filter((pokemon) => {
    // Search by name
    const nameMatch = pokemon.names.English.toLowerCase().includes(term);

    // Search by Pokédex number
    const dexMatch = pokemon.dexNr.toString().includes(term);

    // Search by type
    const primaryTypeMatch =
      pokemon.primaryType.names.English.toLowerCase().includes(term);
    const secondaryTypeMatch =
      pokemon.secondaryType?.names.English.toLowerCase().includes(term);

    return nameMatch || dexMatch || primaryTypeMatch || secondaryTypeMatch;
  });
};

/**
 * Filter Pokémon by type
 */
export const filterByType = (
  pokemonList: Pokemon[],
  type: string
): Pokemon[] => {
  if (!type || type === 'all') return pokemonList;

  return pokemonList.filter((pokemon) => {
    const primaryMatch =
      pokemon.primaryType.names.English.toLowerCase() === type.toLowerCase();
    const secondaryMatch =
      pokemon.secondaryType?.names.English.toLowerCase() === type.toLowerCase();

    return primaryMatch || secondaryMatch;
  });
};

/**
 * Filter Pokémon by generation
 */
export const filterByGeneration = (
  pokemonList: Pokemon[],
  generation: number
): Pokemon[] => {
  if (!generation) return pokemonList;

  return pokemonList.filter((pokemon) => pokemon.generation === generation);
};

/**
 * Get unique types from Pokémon list
 */
export const getUniqueTypes = (pokemonList: Pokemon[]): string[] => {
  const types = new Set<string>();

  pokemonList.forEach((pokemon) => {
    types.add(pokemon.primaryType.names.English);
    if (pokemon.secondaryType) {
      types.add(pokemon.secondaryType.names.English);
    }
  });

  return Array.from(types).sort();
};

/**
 * Get unique generations from Pokémon list
 */
export const getUniqueGenerations = (pokemonList: Pokemon[]): number[] => {
  const generations = new Set<number>();

  pokemonList.forEach((pokemon) => {
    generations.add(pokemon.generation);
  });

  return Array.from(generations).sort((a, b) => a - b);
};
