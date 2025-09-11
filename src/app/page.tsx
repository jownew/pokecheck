'use client';

import React, { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import {
  getPokemonData,
  searchPokemon,
  filterByType,
  filterByGeneration,
  clearCache,
  getStorageInfo,
} from '@/utils/pokemonData';
import LoadingScreen from '@/components/LoadingScreen';
import SearchAndFilter from '@/components/SearchAndFilter';
import PokemonCard from '@/components/PokemonCard';
import PokemonDetail from '@/components/PokemonDetail';

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load Pokémon data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getPokemonData((progress) => {
          setLoadingProgress(progress);
        });

        setAllPokemon(data);
        setFilteredPokemon(data);
      } catch (err) {
        console.error('Error loading Pokémon data:', err);

        // Check if it's a quota error and provide helpful message
        let errorMessage = 'Failed to load Pokémon data';
        if (err instanceof Error) {
          if (
            err.message.includes('quota') ||
            err.message.includes('storage')
          ) {
            const storageInfo = getStorageInfo();
            errorMessage = `Storage quota exceeded (${storageInfo.percentage}% used). Try clearing browser data or use incognito mode.`;
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    let filtered = searchPokemon(allPokemon, searchTerm);
    setFilteredPokemon(filtered);
  };

  // Handle type filter
  const handleTypeFilter = (type: string) => {
    let filtered = allPokemon;
    if (type !== 'all') {
      filtered = filterByType(allPokemon, type);
    }
    setFilteredPokemon(filtered);
  };

  // Handle generation filter
  const handleGenerationFilter = (generation: number | null) => {
    let filtered = allPokemon;
    if (generation) {
      filtered = filterByGeneration(allPokemon, generation);
    }
    setFilteredPokemon(filtered);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredPokemon(allPokemon);
  };

  // Handle Pokémon card click
  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  // Handle close detail modal
  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  // Handle Pokémon selection from detail modal
  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  // Retry function
  const handleRetry = () => {
    setError(null);
    setLoadingProgress(0);
    setIsLoading(true);

    // Reload the page to restart the data loading process
    window.location.reload();
  };

  // Clear cache function
  const handleClearCache = () => {
    clearCache();
    const storageInfo = getStorageInfo();
    console.log('Cache cleared. Storage info:', storageInfo);
    handleRetry();
  };

  // Show loading screen while data is being fetched
  if (isLoading) {
    return (
      <LoadingScreen
        progress={loadingProgress}
        error={error}
        onRetry={handleRetry}
        onClearCache={handleClearCache}
      />
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
              Pokédex
            </h1>
            <div className='text-sm text-gray-600'>
              {filteredPokemon.length} of {allPokemon.length} Pokémon
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Search and Filter */}
        <SearchAndFilter
          pokemonList={allPokemon}
          onSearch={handleSearch}
          onTypeFilter={handleTypeFilter}
          onGenerationFilter={handleGenerationFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Pokémon Grid */}
        {filteredPokemon.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
            {filteredPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={handlePokemonClick}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-gray-500 text-lg'>No Pokémon found</div>
            <div className='text-gray-400 text-sm mt-2'>
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </main>

      {/* Pokémon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          allPokemon={allPokemon}
          onClose={handleCloseDetail}
          onPokemonSelect={handlePokemonSelect}
        />
      )}
    </div>
  );
}
