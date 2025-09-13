'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pokemon, Move, Evolution, EvolutionChainNode } from '@/types/pokemon';
import { typeColors } from './PokemonCard';
import { buildEvolutionChain } from '@/utils/evolutionChain';
import {
  loadTypeChart,
  computeWeaknesses,
  computeResistances,
  computeImmunities,
  computeOffenseStrengths,
} from '@/utils/typeEffectiveness';

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
  const [activeTab, setActiveTab] = useState<
    'stats' | 'moves' | 'evolution' | 'forms'
  >('stats');
  const [imageError, setImageError] = useState(false);

  const [resistances, setResistances] = useState<
    { type: string; multiplier: number }[] | null
  >(null);
  const [immunities, setImmunities] = useState<
    { type: string; multiplier: number }[] | null
  >(null);

  const [offensePrimary, setOffensePrimary] = useState<
    { type: string; multiplier: number }[] | null
  >(null);
  const [offenseSecondary, setOffenseSecondary] = useState<
    { type: string; multiplier: number }[] | null
  >(null);

  const [weaknesses, setWeaknesses] = useState<
    { type: string; multiplier: number }[] | null
  >(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const chart = await loadTypeChart();
        const primary = pokemon.primaryType.names.English;
        const secondary = pokemon.secondaryType?.names.English ?? null;
        const w = computeWeaknesses(primary, secondary, chart);
        const r = computeResistances(primary, secondary, chart);
        const i = computeImmunities(primary, secondary, chart);
        const op = computeOffenseStrengths(primary, chart);
        const os = secondary ? computeOffenseStrengths(secondary, chart) : [];
        if (mounted) {
          setWeaknesses(w);
          setResistances(r);
          setImmunities(i);
          setOffensePrimary(op);
          setOffenseSecondary(os);
        }
      } catch {
        if (mounted) {
          setWeaknesses([]);
          setResistances([]);
          setImmunities([]);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [pokemon]);

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
      return (
        candidate?.toLowerCase().replace(/item_/g, '').replace(/_/g, ' ') ??
        null
      );
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
  function EvolutionBranch({ node }: { node: EvolutionChainNode }) {
    return (
      <div className='flex flex-col items-center'>
        <div
          onClick={() => onPokemonSelect(node.pokemon)}
          className='flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
        >
          <Image
            src={getImageUrl(node.pokemon)}
            alt={node.pokemon.names.English}
            width={48}
            height={48}
            className='object-contain'
          />
          <div>
            <div className='font-medium'>{node.pokemon.names.English}</div>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              {formatPokemonNumber(node.pokemon.dexNr)}
            </div>
          </div>
        </div>

        {node.evolvesTo && node.evolvesTo.length > 0 && (
          <div className='mt-3 flex flex-col items-center'>
            <div className='h-4 w-0.5 bg-gray-300 dark:bg-gray-700'></div>
            <div className='mt-3 flex flex-wrap justify-center gap-6'>
              {node.evolvesTo.map((child) => {
                const req = getEvolutionRequirementBetween(
                  node.pokemon,
                  child.pokemon
                );
                const itemName = normalizeItemName(req?.item as unknown);
                return (
                  <div
                    key={child.pokemon.id}
                    className='flex flex-col items-center'
                  >
                    {req && (
                      <div className='mb-2 flex flex-wrap justify-center gap-1 text-xs'>
                        {Number(req.candies) > 0 && (
                          <span className='px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'>
                            <span aria-hidden='true'>🍬</span>{' '}
                            {Number(req.candies)} candies
                          </span>
                        )}
                        {itemName && (
                          <span className='px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'>
                            <span aria-hidden='true'>🪙</span> {itemName}
                          </span>
                        )}
                        {req.quests && req.quests.length > 0 && (
                          <span className='px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'>
                            <span aria-hidden='true'>⭐</span> special quest
                          </span>
                        )}
                      </div>
                    )}
                    <EvolutionBranch node={child} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const evolutionForest = buildEvolutionChain(pokemon, allPokemon);
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
            { id: 'forms', label: 'Forms' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as 'stats' | 'moves' | 'evolution' | 'forms'
                )
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

                {/* Forms Indicators */}
                <div className='mt-4 flex flex-wrap gap-2'>
                  {pokemon.hasMegaEvolution &&
                    pokemon.megaEvolutions &&
                    Object.keys(pokemon.megaEvolutions).length > 0 && (
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
                        <span className='mr-1'>⚡</span>
                        Mega Evolution Available
                      </span>
                    )}
                  {pokemon.regionForms &&
                    Object.keys(pokemon.regionForms).length > 0 && (
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                        <span className='mr-1'>🌍</span>
                        Regional Forms Available
                      </span>
                    )}
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-2'>Weaknesses</h3>
                {weaknesses === null ? (
                  <div className='text-sm text-gray-500'>Loading...</div>
                ) : weaknesses.length === 0 ? (
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    None
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {weaknesses.map((w) => (
                      <span
                        key={w.type}
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                          w.type
                        )}`}
                      >
                        {w.type} {w.multiplier}x
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <h3 className='text-lg font-semibold mb-2'>Resistances</h3>
                {resistances === null ? (
                  <div className='text-sm text-gray-500'>Loading...</div>
                ) : resistances.length === 0 ? (
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    None
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {resistances.map((r) => (
                      <span
                        key={r.type}
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                          r.type
                        )}`}
                      >
                        {r.type} {r.multiplier}x
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <h3 className='text-lg font-semibold mb-2'>Immunities</h3>
                {immunities === null ? (
                  <div className='text-sm text-gray-500'>Loading...</div>
                ) : immunities.length === 0 ? (
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    None
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {immunities.map((im) => (
                      <span
                        key={im.type}
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                          im.type
                        )}`}
                      >
                        {im.type} 0x
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  Strengths (Offense)
                </h3>
                <div className='mb-1 text-sm text-gray-600 dark:text-gray-300'>
                  Using {pokemon.primaryType.names.English} moves
                </div>
                {offensePrimary === null ? (
                  <div className='text-sm text-gray-500'>Loading...</div>
                ) : offensePrimary.length === 0 ? (
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    None
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {offensePrimary.map((o) => (
                      <span
                        key={`p-${o.type}`}
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium border border-white/30 shadow-sm ${getTypeColor(
                          o.type
                        )}`}
                      >
                        {o.type} {o.multiplier}x
                      </span>
                    ))}
                  </div>
                )}

                {pokemon.secondaryType && (
                  <>
                    <div className='mt-3 mb-1 text-sm text-gray-600 dark:text-gray-300'>
                      Using {pokemon.secondaryType.names.English} moves
                    </div>
                    {offenseSecondary === null ? (
                      <div className='text-sm text-gray-500'>Loading...</div>
                    ) : offenseSecondary.length === 0 ? (
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        None
                      </div>
                    ) : (
                      <div className='flex flex-wrap gap-2'>
                        {offenseSecondary.map((o) => (
                          <span
                            key={`s-${o.type}`}
                            className={`px-3 py-1 rounded-full text-white text-sm font-medium border border-white/30 shadow-sm ${getTypeColor(
                              o.type
                            )}`}
                          >
                            {o.type} {o.multiplier}x
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
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
              <h3 className='text-lg font-semibold mb-4'>Evolution Tree</h3>
              {evolutionForest.length > 0 ? (
                <div className='space-y-8'>
                  {evolutionForest.map((root) => (
                    <div key={root.pokemon.id} className='flex justify-center'>
                      <EvolutionBranch node={root} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-600'>This Pokémon does not evolve.</p>
              )}
            </div>
          )}

          {/* Forms Tab */}
          {activeTab === 'forms' && (
            <div className='space-y-6'>
              {/* Mega Evolutions */}
              {pokemon.hasMegaEvolution &&
                pokemon.megaEvolutions &&
                (Array.isArray(pokemon.megaEvolutions)
                  ? pokemon.megaEvolutions.length > 0
                  : Object.keys(pokemon.megaEvolutions).length > 0) && (
                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Mega Evolutions
                    </h3>
                    <div className='space-y-4'>
                      {(Array.isArray(pokemon.megaEvolutions)
                        ? pokemon.megaEvolutions
                        : Object.values(
                            pokemon.megaEvolutions as unknown as Record<
                              string,
                              unknown
                            >
                          )
                      ).map((mega: unknown, idx) => (
                        <div
                          key={
                            (
                              mega as {
                                formId?: string | number;
                                id?: string | number;
                              }
                            ).formId ||
                            (
                              mega as {
                                formId?: string | number;
                                id?: string | number;
                              }
                            ).id ||
                            idx
                          }
                          className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700'
                        >
                          <div className='flex items-center space-x-4'>
                            {pokemon.assets?.image && (
                              <Image
                                src={pokemon.assets.image}
                                alt={`Mega ${pokemon.names.English}`}
                                width={64}
                                height={64}
                                className='object-contain'
                              />
                            )}
                            <div className='flex-1'>
                              <h4 className='text-lg font-bold text-purple-800 dark:text-purple-200'>
                                Mega {pokemon.names.English}
                              </h4>
                              <div className='mt-2 grid grid-cols-2 gap-4 text-sm'>
                                <div>
                                  <div className='text-gray-600 dark:text-gray-300'>
                                    Energy
                                  </div>
                                  <div className='font-bold text-purple-700 dark:text-purple-300'>
                                    {(mega as { energy?: number }).energy ??
                                      '—'}
                                  </div>
                                </div>
                                <div>
                                  <div className='text-gray-600 dark:text-gray-300'>
                                    Candies
                                  </div>
                                  <div className='font-bold text-purple-700 dark:text-purple-300'>
                                    {(mega as { candies?: number }).candies ??
                                      '—'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Regional Forms */}
              {pokemon.regionForms &&
                Object.keys(pokemon.regionForms).length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Regional Forms
                    </h3>
                    <div className='space-y-4'>
                      {Object.entries(pokemon.regionForms).map(
                        ([key, regionForm]) => (
                          <div
                            key={key}
                            className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700'
                          >
                            <div className='flex items-center space-x-4'>
                              {regionForm.assets?.image && (
                                <Image
                                  src={regionForm.assets.image}
                                  alt={regionForm.names.English}
                                  width={64}
                                  height={64}
                                  className='object-contain'
                                />
                              )}
                              <div className='flex-1'>
                                <h4 className='text-lg font-bold text-blue-800 dark:text-blue-200'>
                                  {regionForm.names.English}
                                </h4>
                                <div className='flex gap-2 mt-2'>
                                  <span
                                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                                      regionForm.primaryType.names.English
                                    )}`}
                                  >
                                    {regionForm.primaryType.names.English}
                                  </span>
                                  {regionForm.secondaryType && (
                                    <span
                                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                                        regionForm.secondaryType.names.English
                                      )}`}
                                    >
                                      {regionForm.secondaryType.names.English}
                                    </span>
                                  )}
                                </div>
                                <div className='grid grid-cols-3 gap-4 mt-3 text-sm'>
                                  <div className='text-center'>
                                    <div className='text-gray-600 dark:text-gray-300'>
                                      HP
                                    </div>
                                    <div className='font-bold text-green-600'>
                                      {regionForm.stats.stamina}
                                    </div>
                                  </div>
                                  <div className='text-center'>
                                    <div className='text-gray-600 dark:text-gray-300'>
                                      Attack
                                    </div>
                                    <div className='font-bold text-red-600'>
                                      {regionForm.stats.attack}
                                    </div>
                                  </div>
                                  <div className='text-center'>
                                    <div className='text-gray-600 dark:text-gray-300'>
                                      Defense
                                    </div>
                                    <div className='font-bold text-blue-600'>
                                      {regionForm.stats.defense}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* No Forms Available */}
              {(!pokemon.hasMegaEvolution ||
                !pokemon.megaEvolutions ||
                Object.keys(pokemon.megaEvolutions).length === 0) &&
                (!pokemon.regionForms ||
                  Object.keys(pokemon.regionForms).length === 0) && (
                  <div className='text-center py-8'>
                    <div className='text-gray-500 dark:text-gray-400 text-lg'>
                      No alternative forms available for this Pokémon.
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
