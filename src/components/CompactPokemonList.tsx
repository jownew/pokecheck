'use client';

import React from 'react';
import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import { typeColors } from './PokemonCard';

interface CompactPokemonListProps {
  pokemonList: Array<{
    pokemon: Pokemon;
    score: number;
    matchingTypes: string[];
  }>;
  onPokemonSelect: (pokemon: Pokemon) => void;
  maxDisplay?: number;
}

const CompactPokemonList: React.FC<CompactPokemonListProps> = ({
  pokemonList,
  onPokemonSelect,
  maxDisplay = 20,
}) => {
  // Get the primary image URL
  const getImageUrl = (pokemon: Pokemon) => {
    if (pokemon.assets?.image) {
      return pokemon.assets.image;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dexNr}.png`;
  };

  // Format Pokemon number
  const formatPokemonNumber = (num: number) => {
    return `#${num.toString().padStart(3, '0')}`;
  };

  // Get type color class
  const getTypeColor = (typeName: string) => {
    return typeColors[typeName] || 'bg-gray-400';
  };

  const displayList = pokemonList.slice(0, maxDisplay);

  if (displayList.length === 0) {
    return (
      <div className='text-center py-4 text-gray-500 dark:text-gray-400'>
        No Pokémon found that exploit this Pokémon&apos;s weaknesses.
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {displayList.map(({ pokemon, score, matchingTypes }) => (
        <div
          key={pokemon.id}
          onClick={() => onPokemonSelect(pokemon)}
          className='flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-3 cursor-pointer transition-colors'
        >
          {/* Pokemon Image */}
          <div className='flex-shrink-0'>
            <Image
              src={getImageUrl(pokemon)}
              alt={pokemon.names.English}
              width={40}
              height={40}
              className='object-contain'
            />
          </div>

          {/* Pokemon Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center space-x-2'>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {formatPokemonNumber(pokemon.dexNr)}
              </span>
              <h4 className='font-medium text-gray-900 dark:text-gray-100 truncate'>
                {pokemon.names.English}
              </h4>
            </div>

            {/* Types */}
            <div className='flex gap-1 mt-1'>
              <span
                className={`px-2 py-0.5 rounded text-xs text-white font-medium ${getTypeColor(
                  pokemon.primaryType.names.English
                )}`}
              >
                {pokemon.primaryType.names.English}
              </span>
              {pokemon.secondaryType && (
                <span
                  className={`px-2 py-0.5 rounded text-xs text-white font-medium ${getTypeColor(
                    pokemon.secondaryType.names.English
                  )}`}
                >
                  {pokemon.secondaryType.names.English}
                </span>
              )}
            </div>
          </div>

          {/* Effectiveness Score */}
          <div className='flex-shrink-0 text-right'>
            <div className='text-sm font-bold text-red-600 dark:text-red-400'>
              {score}x
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {matchingTypes.length > 1 ? 'Multi-type' : 'Single-type'}
            </div>
          </div>
        </div>
      ))}

      {pokemonList.length > maxDisplay && (
        <div className='text-center py-2 text-sm text-gray-500 dark:text-gray-400'>
          Showing {maxDisplay} of {pokemonList.length} Pokémon
        </div>
      )}
    </div>
  );
};

export default CompactPokemonList;
