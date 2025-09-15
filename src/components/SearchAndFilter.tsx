'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pokemon } from '@/types/pokemon';
import { getUniqueTypes, getUniqueGenerations } from '@/utils/pokemonData';

interface SearchAndFilterProps {
  pokemonList: Pokemon[];
  onSearch: (searchTerm: string) => void;
  onTypeFilter: (types: string[]) => void;
  onGenerationFilter: (generations: number[]) => void;
  onClearFilters: () => void;
  // Optional controlled values from parent so dashboard clicks show up in chips
  selectedTypesValue?: string[];
  selectedGenerationsValue?: number[];
  searchTermValue?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  pokemonList,
  onSearch,
  onTypeFilter,
  onGenerationFilter,
  onClearFilters,
  selectedTypesValue,
  selectedGenerationsValue,
  searchTermValue,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Use ref to store the latest onSearch function to avoid dependency issues
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Refs to avoid unstable callback deps causing effect loops
  const onTypeFilterRef = useRef(onTypeFilter);
  onTypeFilterRef.current = onTypeFilter;
  const onGenerationFilterRef = useRef(onGenerationFilter);
  onGenerationFilterRef.current = onGenerationFilter;

  const uniqueTypes = getUniqueTypes(pokemonList);
  const uniqueGenerations = getUniqueGenerations(pokemonList);

  // Debounce search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Sync internal state from optional controlled props
  useEffect(() => {
    if (Array.isArray(selectedTypesValue)) {
      setSelectedTypes((prev) => {
        const next = selectedTypesValue ?? [];
        // Avoid unnecessary state updates
        if (
          prev.length === next.length &&
          prev.every((v, i) => v === next[i])
        ) {
          return prev;
        }
        return next;
      });
    }
  }, [selectedTypesValue]);

  useEffect(() => {
    if (Array.isArray(selectedGenerationsValue)) {
      setSelectedGenerations((prev) => {
        const next = selectedGenerationsValue ?? [];
        if (
          prev.length === next.length &&
          prev.every((v, i) => v === next[i])
        ) {
          return prev;
        }
        return next;
      });
    }
  }, [selectedGenerationsValue]);

  useEffect(() => {
    if (typeof searchTermValue === 'string') {
      setSearchTerm(searchTermValue);
      if (searchTermValue === '') setDebouncedSearchTerm('');
    }
  }, [searchTermValue]);

  // Trigger search when debounced search term changes
  useEffect(() => {
    onSearchRef.current(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // If clearing the search, clear debounced term immediately
    if (value === '') {
      setDebouncedSearchTerm('');
    }
  };

  // Propagate type selection changes to parent after render
  useEffect(() => {
    onTypeFilterRef.current(selectedTypes);
  }, [selectedTypes]);

  // Propagate generation selection changes to parent after render
  useEffect(() => {
    onGenerationFilterRef.current(selectedGenerations);
  }, [selectedGenerations]);

  // Handle type filter toggle
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Handle generation filter toggle
  const handleGenerationToggle = (generation: number) => {
    setSelectedGenerations((prev) =>
      prev.includes(generation)
        ? prev.filter((g) => g !== generation)
        : [...prev, generation]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm(''); // Clear debounced term immediately
    setSelectedTypes([]);
    setSelectedGenerations([]);
    onClearFilters();
  };

  // Check if any filters are active
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedTypes.length > 0 ||
    selectedGenerations.length > 0;

  return (
    <div className='bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 mb-6'>
      {/* Search Bar */}
      <div className='relative mb-4'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-5 w-5 text-gray-400 dark:text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <input
          type='text'
          placeholder='Search Pokémon by name, type, or number...'
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {searchTerm && (
          <button
            onClick={() => handleSearchChange('')}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            <svg
              className='h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className='flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors'
        >
          <svg
            className='h-5 w-5 text-gray-600 dark:text-gray-300'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z'
            />
          </svg>
          <span className='text-gray-700 dark:text-gray-200'>Filters</span>
          <svg
            className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
              isFilterOpen ? 'rotate-180' : ''
            }`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className='px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Type Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
              Filter by Type
            </label>
            <div className='w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-3 max-h-56 overflow-auto grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {uniqueTypes.map((type) => (
                <label
                  key={type}
                  className='flex items-center gap-2 text-gray-800 dark:text-gray-100'
                >
                  <input
                    type='checkbox'
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500'
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            <div className='mt-2'>
              <button
                onClick={() => {
                  setSelectedTypes([]);
                }}
                className='text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 underline'
              >
                Clear Types
              </button>
            </div>
          </div>

          {/* Generation Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
              Filter by Generation
            </label>
            <div className='w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-3 max-h-56 overflow-auto grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {uniqueGenerations.map((gen) => (
                <label
                  key={gen}
                  className='flex items-center gap-2 text-gray-800 dark:text-gray-100'
                >
                  <input
                    type='checkbox'
                    checked={selectedGenerations.includes(gen)}
                    onChange={() => handleGenerationToggle(gen)}
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500'
                  />
                  <span>Generation {gen}</span>
                </label>
              ))}
            </div>
            <div className='mt-2'>
              <button
                onClick={() => {
                  setSelectedGenerations([]);
                }}
                className='text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 underline'
              >
                Clear Generations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {searchTerm && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
              Search: &quot;{searchTerm}&quot;
              <button
                onClick={() => handleSearchChange('')}
                className='ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200'
              >
                ×
              </button>
            </span>
          )}
          {selectedTypes.map((type) => (
            <span
              key={type}
              className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            >
              Type: {type}
              <button
                onClick={() => handleTypeToggle(type)}
                className='ml-2 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200'
              >
                ×
              </button>
            </span>
          ))}
          {selectedGenerations.map((gen) => (
            <span
              key={gen}
              className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            >
              Gen {gen}
              <button
                onClick={() => handleGenerationToggle(gen)}
                className='ml-2 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200'
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
