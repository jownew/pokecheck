'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Pokemon, Move, Evolution } from '@/types/pokemon';
import { typeColors } from './PokemonCard';
import { getPreEvolutions, getEvolutions } from '@/utils/evolutionChain';

interface PokemonDetailProps {
  pokemon: Pokemon;
  allPokemon: Pokemon[];
  onClose: () => void;
  onPokemonSelect: (pokemon: Pokemon) => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({
  pokemon,
  allPokemon,
  onClose,
  onPokemonSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'moves' | 'evolution'>(
    'stats'
  );
  const [imageError, setImageError] = useState(false);

  // Get the primary image URL
  const getImageUrl = (poke: Pokemon, shiny: boolean = false) => {
    if (poke.assets?.image && !shiny) {
      return poke.assets.image;
    }
    if (poke.assets?.shinyImage && shiny) {
      return poke.assets.shinyImage;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.dexNr}.png`;
  };

  // Format Pokemon number
  const formatPokemonNumber = (num: number) => {
    return `#${num.toString().padStart(3, '0')}`;
  };

  // Get type color class
  const getTypeColor = (typeName: string) => {
    return typeColors[typeName] || 'bg-gray-400';
  };

  // Get evolution chain including previous and next stages
  const getEvolutionChain = () => {
    const chain: Pokemon[] = [];

    // Walk backwards to base form (choose the first path when multiple exist)
    let current: Pokemon = pokemon;
    const visited = new Set<string>();
    while (true) {
      const preEvos = getPreEvolutions(current, allPokemon);
      if (!preEvos || preEvos.length === 0) break;
      const prev = preEvos[0];
      if (visited.has(prev.id)) break;
      chain.unshift(prev);
      visited.add(prev.id);
      current = prev;
    }

    // Add current
    chain.push(pokemon);

    // Add next evolutions (direct only)
    const nextEvos = getEvolutions(pokemon, allPokemon);

    nextEvos.forEach((mon) => chain.push(mon));

    return chain;
  };

  // Convert moves object to array
  const getMovesArray = (moves: Record<string, Move>) => {
    return Object.values(moves);
  };

  // Normalize item field which may be string/object/number depending on data
  const normalizeItemName = (item: unknown): string | null => {
    if (item == null) return null;
    if (typeof item === 'string') return item;
    if (typeof item === 'number') return String(item);
    if (typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      const id =
        typeof obj['id'] === 'string' ? (obj['id'] as string) : undefined;
      const name =
        typeof obj['name'] === 'string' ? (obj['name'] as string) : undefined;
      const names = obj['names'] as Record<string, unknown> | undefined;
      const Names = obj['Names'] as Record<string, unknown> | undefined;
      const namesEnglish =
        names && typeof names['English'] === 'string'
          ? (names['English'] as string)
          : undefined;
      const NamesEnglish =
        Names && typeof Names['English'] === 'string'
          ? (Names['English'] as string)
          : undefined;
      const english =
        typeof obj['English'] === 'string'
          ? (obj['English'] as string)
          : undefined;
      const candidate = id ?? name ?? namesEnglish ?? NamesEnglish ?? english;
      return candidate ?? null;
    }
    return null;
  };

  // Get formatted requirements between two stages if there's a direct evolution
  // Get raw evolution requirement (Evolution object) between two stages
  const getEvolutionRequirementBetween = (
    from: Pokemon,
    to: Pokemon
  ): Evolution | null => {
    if (!from || !to) return null;
    const evo = from.evolutions?.find((e) => e.id === to.id);
    return evo || null;
  };

  const evolutionChain = getEvolutionChain();
  const quickMoves = getMovesArray(pokemon.quickMoves);
  const cinematicMoves = getMovesArray(pokemon.cinematicMoves);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='relative bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-white hover:text-gray-200 transition-colors'
          >
            <svg
              className='w-6 h-6'
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

          <div className='flex items-center space-x-4'>
            <div className='relative'>
              {!imageError ? (
                <Image
                  src={getImageUrl(pokemon)}
                  alt={pokemon.names.English}
                  width={80}
                  height={80}
                  className='object-contain'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>No Image</span>
                </div>
              )}
            </div>

            <div>
              <div className='text-sm opacity-80'>
                {formatPokemonNumber(pokemon.dexNr)}
              </div>
              <h1 className='text-2xl font-bold'>{pokemon.names.English}</h1>
              <div className='flex gap-2 mt-2'>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                    pokemon.primaryType.names.English
                  )}`}
                >
                  {pokemon.primaryType.names.English}
                </span>
                {pokemon.secondaryType && (
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                      pokemon.secondaryType.names.English
                    )}`}
                  >
                    {pokemon.secondaryType.names.English}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex border-b'>
          {[
            { id: 'stats', label: 'Stats' },
            { id: 'moves', label: 'Moves' },
            { id: 'evolution', label: 'Evolution' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as 'stats' | 'moves' | 'evolution')
              }
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='p-6 max-h-96 overflow-y-auto'>
          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-4'>Base Stats</h3>
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        HP (Stamina)
                      </span>
                      <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
                        {pokemon.stats.stamina}
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full'
                        style={{
                          width: `${(pokemon.stats.stamina / 250) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Attack
                      </span>
                      <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
                        {pokemon.stats.attack}
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-red-500 h-2 rounded-full'
                        style={{
                          width: `${(pokemon.stats.attack / 350) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Defense
                      </span>
                      <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
                        {pokemon.stats.defense}
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-blue-500 h-2 rounded-full'
                        style={{
                          width: `${(pokemon.stats.defense / 350) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-2'>Additional Info</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Generation:
                    </span>
                    <span className='ml-2 font-medium'>
                      {pokemon.generation}
                    </span>
                  </div>
                  {pokemon.pokemonClass && (
                    <div>
                      <span className='text-gray-600 dark:text-gray-300'>
                        Class:
                      </span>
                      <span className='ml-2 font-medium'>
                        {pokemon.pokemonClass.replace('POKEMON_CLASS_', '')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Moves Tab */}
          {activeTab === 'moves' && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-4'>Quick Moves</h3>
                <div className='space-y-2'>
                  {quickMoves.map((move) => (
                    <div
                      key={move.id}
                      className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3'
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <h4 className='font-medium dark:text-gray-100'>
                            {move.names.English}
                          </h4>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 ${getTypeColor(
                              move.type.names.English
                            )}`}
                          >
                            {move.type.names.English}
                          </span>
                        </div>
                        <div className='text-right text-sm'>
                          <div>Power: {move.power}</div>
                          <div>Energy: {move.energy}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-4'>Cinematic Moves</h3>
                <div className='space-y-2'>
                  {cinematicMoves.map((move) => (
                    <div
                      key={move.id}
                      className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3'
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <h4 className='font-medium dark:text-gray-100'>
                            {move.names.English}
                          </h4>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 ${getTypeColor(
                              move.type.names.English
                            )}`}
                          >
                            {move.type.names.English}
                          </span>
                        </div>
                        <div className='text-right text-sm'>
                          <div>Power: {move.power}</div>
                          <div>Energy: {move.energy}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Evolution Tab */}
          {activeTab === 'evolution' && (
            <div>
              <h3 className='text-lg font-semibold mb-4'>Evolution Chain</h3>
              {evolutionChain.length > 1 ? (
                <div className='space-y-4'>
                  {evolutionChain.map((evo, index) => (
                    <div key={evo.id} className='flex items-center space-x-4'>
                      <div
                        onClick={() => onPokemonSelect(evo)}
                        className='flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1'
                      >
                        <Image
                          src={getImageUrl(evo)}
                          alt={evo.names.English}
                          width={48}
                          height={48}
                          className='object-contain'
                        />
                        <div>
                          <div className='font-medium'>{evo.names.English}</div>
                          <div className='text-sm text-gray-600 dark:text-gray-300'>
                            {formatPokemonNumber(evo.dexNr)}
                          </div>
                        </div>
                      </div>
                      {index < evolutionChain.length - 1 &&
                        (() => {
                          const req = getEvolutionRequirementBetween(
                            evolutionChain[index],
                            evolutionChain[index + 1]
                          );
                          const itemName = normalizeItemName(
                            req?.item as unknown
                          );
                          return (
                            <div className='text-gray-400 dark:text-gray-500 flex flex-col items-center min-w-[1.5rem]'>
                              <svg
                                className='w-6 h-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M9 5l7 7-7 7'
                                />
                              </svg>
                              {req && (
                                <div className='flex flex-wrap justify-center gap-1 mt-1'>
                                  {Number(req.candies) > 0 && (
                                    <span className='px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'>
                                      <span aria-hidden='true'>🍬</span>
                                      <span className='sr-only'>
                                        candies:
                                      </span>{' '}
                                      {Number(req.candies)} candies
                                    </span>
                                  )}
                                  {itemName && (
                                    <span className='px-2 py-0.5 rounded-full text-xs bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'>
                                      <span aria-hidden='true'>🪙</span>
                                      <span className='sr-only'>
                                        item:
                                      </span>{' '}
                                      {itemName
                                        .replace(/_/g, ' ')
                                        .toLowerCase()}
                                    </span>
                                  )}
                                  {req.quests && req.quests.length > 0 && (
                                    <span className='px-2 py-0.5 rounded-full text-xs bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'>
                                      <span aria-hidden='true'>⭐</span>
                                      <span className='sr-only'>
                                        special quest
                                      </span>{' '}
                                      special quest
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-600'>This Pokémon does not evolve.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
