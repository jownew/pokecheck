'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

// Type color mapping for consistent styling
export const typeColors: Record<string, string> = {
  Normal: 'bg-gray-400',
  Fire: 'bg-red-500',
  Water: 'bg-blue-500',
  Electric: 'bg-yellow-400',
  Grass: 'bg-green-500',
  Ice: 'bg-blue-300',
  Fighting: 'bg-red-700',
  Poison: 'bg-purple-500',
  Ground: 'bg-yellow-600',
  Flying: 'bg-indigo-400',
  Psychic: 'bg-pink-500',
  Bug: 'bg-green-400',
  Rock: 'bg-yellow-800',
  Ghost: 'bg-purple-700',
  Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-800',
  Steel: 'bg-gray-500',
  Fairy: 'bg-pink-300',
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the primary image URL
  const getImageUrl = () => {
    if (pokemon.assets?.image) {
      return pokemon.assets.image;
    }
    // Fallback to a default Pokemon image if no assets
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dexNr}.png`;
  };

  // Format Pokemon number with leading zeros
  const formatPokemonNumber = (num: number) => {
    return `#${num.toString().padStart(3, '0')}`;
  };

  // Get type color class
  const getTypeColor = (typeName: string) => {
    return typeColors[typeName] || 'bg-gray-400';
  };

  return (
    <div
      onClick={() => onClick(pokemon)}
      className='bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden'
    >
      {/* Header with number and name */}
      <div className='p-4 pb-2'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            {formatPokemonNumber(pokemon.dexNr)}
          </span>
          <span className='text-xs text-gray-400 dark:text-gray-500'>
            Gen {pokemon.generation}
          </span>
        </div>
        <h3 className='text-lg font-bold text-gray-800 dark:text-gray-100 truncate'>
          {pokemon.names.English}
        </h3>
      </div>

      {/* Pokemon Image */}
      <div className='relative h-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'>
        {!imageError ? (
          <Image
            src={getImageUrl()}
            alt={pokemon.names.English}
            width={96}
            height={96}
            className={`object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          <div className='w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center'>
            <span className='text-gray-400 dark:text-gray-300 text-xs'>
              No Image
            </span>
          </div>
        )}

        {/* Loading placeholder */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'></div>
          </div>
        )}
      </div>

      {/* Types */}
      <div className='px-4 py-2'>
        <div className='flex gap-2 justify-center'>
          <span
            className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getTypeColor(
              pokemon.primaryType.names.English
            )}`}
          >
            {pokemon.primaryType.names.English}
          </span>
          {pokemon.secondaryType && (
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getTypeColor(
                pokemon.secondaryType.names.English
              )}`}
            >
              {pokemon.secondaryType.names.English}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className='px-4 pb-4'>
        <div className='space-y-2'>
          {/* HP/Stamina */}
          <div className='flex items-center justify-between text-xs'>
            <span className='text-gray-600 dark:text-gray-300 font-medium'>
              HP
            </span>
            <span className='font-bold text-gray-800 dark:text-gray-100'>
              {pokemon.stats.stamina}
            </span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
            <div
              className='bg-green-500 h-1.5 rounded-full transition-all duration-300'
              style={{ width: `${(pokemon.stats.stamina / 250) * 100}%` }}
            ></div>
          </div>

          {/* Attack */}
          <div className='flex items-center justify-between text-xs'>
            <span className='text-gray-600 dark:text-gray-300 font-medium'>
              ATK
            </span>
            <span className='font-bold text-gray-800 dark:text-gray-100'>
              {pokemon.stats.attack}
            </span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
            <div
              className='bg-red-500 h-1.5 rounded-full transition-all duration-300'
              style={{ width: `${(pokemon.stats.attack / 350) * 100}%` }}
            ></div>
          </div>

          {/* Defense */}
          <div className='flex items-center justify-between text-xs'>
            <span className='text-gray-600 dark:text-gray-300 font-medium'>
              DEF
            </span>
            <span className='font-bold text-gray-800 dark:text-gray-100'>
              {pokemon.stats.defense}
            </span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
            <div
              className='bg-blue-500 h-1.5 rounded-full transition-all duration-300'
              style={{ width: `${(pokemon.stats.defense / 350) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Evolution indicator */}
        {pokemon.evolutions.length > 0 && (
          <div className='mt-3 flex items-center justify-center'>
            <span className='text-xs text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded-full'>
              Can evolve
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
