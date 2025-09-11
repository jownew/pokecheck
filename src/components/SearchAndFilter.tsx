'use client';

import React, { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { getUniqueTypes, getUniqueGenerations } from '@/utils/pokemonData';

interface SearchAndFilterProps {
  pokemonList: Pokemon[];
  onSearch: (searchTerm: string) => void;
  onTypeFilter: (type: string) => void;
  onGenerationFilter: (generation: number | null) => void;
  onClearFilters: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  pokemonList,
  onSearch,
  onTypeFilter,
  onGenerationFilter,
  onClearFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const uniqueTypes = getUniqueTypes(pokemonList);
  const uniqueGenerations = getUniqueGenerations(pokemonList);

  // Debounce search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle type filter changes
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onTypeFilter(type);
  };

  // Handle generation filter changes
  const handleGenerationChange = (generation: number | null) => {
    setSelectedGeneration(generation);
    onGenerationFilter(generation);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedGeneration(null);
    onClearFilters();
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm || selectedType !== 'all' || selectedGeneration !== null;

  return (
    <div className='bg-white shadow-lg rounded-lg p-4 mb-6'>
      {/* Search Bar */}
      <div className='relative mb-4'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-5 w-5 text-gray-400'
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
          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
        />
        {searchTerm && (
          <button
            onClick={() => handleSearchChange('')}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            <svg
              className='h-5 w-5 text-gray-400 hover:text-gray-600'
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
          className='flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
        >
          <svg
            className='h-5 w-5 text-gray-600'
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
          <span className='text-gray-700'>Filters</span>
          <svg
            className={`h-4 w-4 text-gray-600 transition-transform ${
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
            className='px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
            >
              <option value='all'>All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Generation Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Generation
            </label>
            <select
              value={selectedGeneration || ''}
              onChange={(e) =>
                handleGenerationChange(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
            >
              <option value=''>All Generations</option>
              {uniqueGenerations.map((gen) => (
                <option key={gen} value={gen}>
                  Generation {gen}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {searchTerm && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
              Search: &quot;{searchTerm}&quot;
              <button
                onClick={() => handleSearchChange('')}
                className='ml-2 text-blue-600 hover:text-blue-800'
              >
                ×
              </button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'>
              Type: {selectedType}
              <button
                onClick={() => handleTypeChange('all')}
                className='ml-2 text-green-600 hover:text-green-800'
              >
                ×
              </button>
            </span>
          )}
          {selectedGeneration && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800'>
              Gen {selectedGeneration}
              <button
                onClick={() => handleGenerationChange(null)}
                className='ml-2 text-purple-600 hover:text-purple-800'
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
