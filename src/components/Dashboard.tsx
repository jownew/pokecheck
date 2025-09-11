'use client';

import React from 'react';
import { Pokemon } from '@/types/pokemon';

interface DashboardProps {
  allPokemon: Pokemon[];
  onQuickFilter: (type: string) => void;
  onGenerationFilter: (generation: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  allPokemon,
  onQuickFilter,
  onGenerationFilter,
}) => {
  // Calculate stats
  const totalPokemon = allPokemon.length;
  const uniqueTypes = Array.from(
    new Set(
      allPokemon.flatMap((p) => [
        p.primaryType.names.English,
        p.secondaryType?.names.English,
      ].filter(Boolean))
    )
  );
  const generations = Array.from(
    new Set(allPokemon.map((p) => p.generation))
  ).sort((a, b) => a - b);

  // Popular types for quick access
  const popularTypes = [
    { name: 'Fire', color: 'bg-red-500', icon: '🔥' },
    { name: 'Water', color: 'bg-blue-500', icon: '💧' },
    { name: 'Grass', color: 'bg-green-500', icon: '🌿' },
    { name: 'Electric', color: 'bg-yellow-500', icon: '⚡' },
    { name: 'Psychic', color: 'bg-pink-500', icon: '🔮' },
    { name: 'Dragon', color: 'bg-purple-600', icon: '🐉' },
    { name: 'Ghost', color: 'bg-indigo-600', icon: '👻' },
    { name: 'Steel', color: 'bg-gray-500', icon: '⚔️' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl text-white">
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden">
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-black transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full border-4 border-black transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-gray-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-100 to-gray-200 rounded-b-full"></div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Pokédex
        </h1>
        <p className="text-xl opacity-90 mb-6">
          Discover and explore the world of Pokémon
        </p>
        <p className="text-lg opacity-80">
          Use the search bar above or browse by type and generation below
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {totalPokemon.toLocaleString()}
          </div>
          <div className="text-gray-600">Total Pokémon</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {uniqueTypes.length}
          </div>
          <div className="text-gray-600">Unique Types</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {generations.length}
          </div>
          <div className="text-gray-600">Generations</div>
        </div>
      </div>

      {/* Quick Type Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Browse by Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {popularTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => onQuickFilter(type.name)}
              className={`${type.color} text-white rounded-xl p-4 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-semibold text-sm">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generation Browser */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Browse by Generation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((gen) => {
            const genPokemon = allPokemon.filter((p) => p.generation === gen);
            const genNames = [
              'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova',
              'Kalos', 'Alola', 'Galar', 'Paldea'
            ];
            
            return (
              <button
                key={gen}
                onClick={() => onGenerationFilter(gen)}
                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-gray-800">
                      Generation {gen}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {genNames[gen - 1] || `Gen ${gen}`}
                    </div>
                    <div className="text-blue-600 font-semibold text-sm mt-1">
                      {genPokemon.length} Pokémon
                    </div>
                  </div>
                  <div className="text-2xl">
                    {gen === 1 ? '🔴' : gen === 2 ? '🟡' : gen === 3 ? '🔵' : 
                     gen === 4 ? '💎' : gen === 5 ? '⚫' : gen === 6 ? '🌟' :
                     gen === 7 ? '🌺' : gen === 8 ? '⚔️' : '🍇'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Explore Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Search</h3>
            <p className="text-gray-600 text-sm">
              Search by name, type, or Pokédex number
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Detailed Stats</h3>
            <p className="text-gray-600 text-sm">
              View comprehensive stats and moves
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Evolution Chains</h3>
            <p className="text-gray-600 text-sm">
              Explore evolution paths and requirements
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">PWA Ready</h3>
            <p className="text-gray-600 text-sm">
              Install as an app for offline access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
