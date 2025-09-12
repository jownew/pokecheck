'use client';

import React, { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import {
  getPokemonData,
  searchPokemon,
  filterByType,
  filterByGeneration,
  getStorageInfo,
} from '@/utils/pokemonData';
import LoadingScreen from '@/components/LoadingScreen';
import { resetAppFreshReload, confirmResetAndReload } from '@/utils/resetApp';
import SearchAndFilter from '@/components/SearchAndFilter';
import PokemonCard from '@/components/PokemonCard';
import PokemonDetail from '@/components/PokemonDetail';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);

  // Theme preference (system | light | dark)
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as
        | 'system'
        | 'light'
        | 'dark'
        | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setTheme(stored);
      }
    } catch {}
  }, []);

  const applyTheme = (next: 'system' | 'light' | 'dark') => {
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const isDark = next === 'dark' || (next === 'system' && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
      // Also hint to the UA for built-ins
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    } catch {}
  };

  const cycleTheme = () => {
    const next =
      theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    applyTheme(next);
  };

  // Keep "system" theme reactive to OS changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const isDark = e.matches;
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      }
    };
    try {
      mql.addEventListener('change', handler);
    } catch {
      // Safari < 14
      mql.addListener(handler);
    }
    return () => {
      try {
        mql.removeEventListener('change', handler);
      } catch {
        mql.removeListener(handler);
      }
    };
  }, [theme]);

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
        setFilteredPokemon([]);
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
    if (searchTerm.trim()) {
      const filtered = searchPokemon(allPokemon, searchTerm);
      setFilteredPokemon(filtered);
      setShowDashboard(false);
    } else {
      setFilteredPokemon([]);
      setShowDashboard(true);
    }
  };

  // Handle type filter
  const handleTypeFilter = (type: string) => {
    if (type !== 'all') {
      const filtered = filterByType(allPokemon, type);
      setFilteredPokemon(filtered);
      setShowDashboard(false);
    } else {
      setFilteredPokemon([]);
      setShowDashboard(true);
    }
  };

  // Handle generation filter
  const handleGenerationFilter = (generation: number | null) => {
    if (generation) {
      const filtered = filterByGeneration(allPokemon, generation);
      setFilteredPokemon(filtered);
      setShowDashboard(false);
    } else {
      setFilteredPokemon([]);
      setShowDashboard(true);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredPokemon([]);
    setShowDashboard(true);
  };

  // Handle quick filter from dashboard
  const handleQuickFilter = (type: string) => {
    const filtered = filterByType(allPokemon, type);
    setFilteredPokemon(filtered);
    setShowDashboard(false);
  };

  // Handle generation filter from dashboard
  const handleDashboardGenerationFilter = (generation: number) => {
    const filtered = filterByGeneration(allPokemon, generation);
    setFilteredPokemon(filtered);
    setShowDashboard(false);
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
  const handleRetry = async () => {
    setError(null);
    setLoadingProgress(0);
    setIsLoading(true);

    // Reset caches and reload fresh
    await resetAppFreshReload();
  };

  // Clear cache function
  const handleClearCache = async () => {
    await resetAppFreshReload();
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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-950 shadow-sm border-b dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100'>
              Pokédex
            </h1>
            <div className='flex items-center gap-3'>
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                {showDashboard
                  ? `${allPokemon.length} Pokémon available`
                  : `${filteredPokemon.length} of ${allPokemon.length} Pokémon`}
              </div>
              <button
                onClick={cycleTheme}
                className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline'
                title='Toggle theme (system → light → dark)'
                aria-label='Toggle theme'
              >
                {theme === 'dark'
                  ? '🌙 Dark'
                  : theme === 'light'
                  ? '☀️ Light'
                  : '🖥️ System'}
              </button>

              <button
                onClick={confirmResetAndReload}
                className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline'
                title='Clear caches and reload app'
                aria-label='Reset app (fresh reload)'
              >
                Reset app (fresh)
              </button>
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

        {/* Dashboard or Pokémon Grid */}
        {showDashboard ? (
          <Dashboard
            allPokemon={allPokemon}
            onQuickFilter={handleQuickFilter}
            onGenerationFilter={handleDashboardGenerationFilter}
          />
        ) : filteredPokemon.length > 0 ? (
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
            <div className='text-gray-500 dark:text-gray-300 text-lg'>
              No Pokémon found
            </div>
            <div className='text-gray-400 dark:text-gray-400 text-sm mt-2'>
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
