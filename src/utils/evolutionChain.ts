import { Pokemon, EvolutionChainNode } from '@/types/pokemon';

/**
 * Build a complete evolution chain for a given Pokémon
 * This function finds all Pokémon in the same evolution family
 */
export const buildEvolutionChain = (
  pokemon: Pokemon,
  allPokemon: Pokemon[]
): EvolutionChainNode[] => {
  // Find the base form (Pokémon with no pre-evolution)
  const baseForms = findBaseForms(pokemon, allPokemon);
  
  // Build the chain starting from each base form
  return baseForms.map(basePokemon => buildChainFromBase(basePokemon, allPokemon));
};

/**
 * Find all base forms (Pokémon that don't evolve from anything) in the evolution family
 */
const findBaseForms = (pokemon: Pokemon, allPokemon: Pokemon[]): Pokemon[] => {
  const evolutionFamily = getEvolutionFamily(pokemon, allPokemon);
  
  return evolutionFamily.filter(poke => {
    // A Pokémon is a base form if no other Pokémon evolves into it
    return !evolutionFamily.some(otherPoke => 
      otherPoke.evolutions.some(evo => evo.id === poke.id)
    );
  });
};

/**
 * Get all Pokémon in the same evolution family
 */
const getEvolutionFamily = (pokemon: Pokemon, allPokemon: Pokemon[]): Pokemon[] => {
  const family = new Set<Pokemon>();
  const toProcess = [pokemon];
  const processed = new Set<string>();

  while (toProcess.length > 0) {
    const current = toProcess.pop()!;
    
    if (processed.has(current.id)) continue;
    processed.add(current.id);
    
    family.add(current);

    // Add all Pokémon this one evolves into
    current.evolutions.forEach(evo => {
      const evolvedPokemon = allPokemon.find(p => p.id === evo.id);
      if (evolvedPokemon && !processed.has(evolvedPokemon.id)) {
        toProcess.push(evolvedPokemon);
      }
    });

    // Add all Pokémon that evolve into this one
    allPokemon.forEach(poke => {
      if (poke.evolutions.some(evo => evo.id === current.id) && !processed.has(poke.id)) {
        toProcess.push(poke);
      }
    });
  }

  return Array.from(family);
};

/**
 * Build evolution chain starting from a base form
 */
const buildChainFromBase = (basePokemon: Pokemon, allPokemon: Pokemon[]): EvolutionChainNode => {
  const buildNode = (pokemon: Pokemon): EvolutionChainNode => {
    const evolvesTo: EvolutionChainNode[] = [];

    pokemon.evolutions.forEach(evolution => {
      const evolvedPokemon = allPokemon.find(p => p.id === evolution.id);
      if (evolvedPokemon) {
        evolvesTo.push(buildNode(evolvedPokemon));
      }
    });

    return {
      pokemon,
      evolvesTo,
      evolutionRequirements: pokemon.evolutions.length > 0 ? {
        candies: pokemon.evolutions[0].candies,
        item: pokemon.evolutions[0].item || undefined,
        quests: pokemon.evolutions[0].quests.length > 0 ? pokemon.evolutions[0].quests : undefined,
      } : undefined,
    };
  };

  return buildNode(basePokemon);
};

/**
 * Get all Pokémon that can evolve into the given Pokémon
 */
export const getPreEvolutions = (pokemon: Pokemon, allPokemon: Pokemon[]): Pokemon[] => {
  return allPokemon.filter(poke => 
    poke.evolutions.some(evo => evo.id === pokemon.id)
  );
};

/**
 * Get all Pokémon that the given Pokémon can evolve into
 */
export const getEvolutions = (pokemon: Pokemon, allPokemon: Pokemon[]): Pokemon[] => {
  return pokemon.evolutions
    .map(evo => allPokemon.find(p => p.id === evo.id))
    .filter((p): p is Pokemon => p !== undefined);
};

/**
 * Check if two Pokémon are in the same evolution family
 */
export const areInSameEvolutionFamily = (
  pokemon1: Pokemon,
  pokemon2: Pokemon,
  allPokemon: Pokemon[]
): boolean => {
  const family1 = getEvolutionFamily(pokemon1, allPokemon);
  return family1.some(p => p.id === pokemon2.id);
};

/**
 * Get the evolution stage of a Pokémon (0 = base, 1 = first evolution, etc.)
 */
export const getEvolutionStage = (pokemon: Pokemon, allPokemon: Pokemon[]): number => {
  let stage = 0;
  let current = pokemon;

  // Trace back to find the base form
  while (true) {
    const preEvolution = getPreEvolutions(current, allPokemon)[0];
    if (!preEvolution) break;
    
    current = preEvolution;
    stage++;
  }

  return stage;
};

/**
 * Format evolution requirements for display
 */
export const formatEvolutionRequirements = (
  evolution: { candies: number; item?: string; quests?: string[] }
): string => {
  const parts: string[] = [];
  
  if (evolution.candies > 0) {
    parts.push(`${evolution.candies} candies`);
  }
  
  if (evolution.item) {
    parts.push(evolution.item.replace(/_/g, ' ').toLowerCase());
  }
  
  if (evolution.quests && evolution.quests.length > 0) {
    parts.push('special quest');
  }
  
  return parts.join(', ') || 'Unknown requirements';
};
