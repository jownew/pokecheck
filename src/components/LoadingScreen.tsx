'use client';

import React from 'react';

interface LoadingScreenProps {
  progress: number;
  error?: string | null;
  onRetry?: () => void;
  onClearCache?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  error,
  onRetry,
  onClearCache,
}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center'>
        {/* Pokéball Icon */}
        <div className='mb-6 flex justify-center'>
          <div className='relative w-24 h-24'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden'>
              <div className='absolute top-1/2 left-0 right-0 h-1 bg-black transform -translate-y-1/2'></div>
              <div className='absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full border-4 border-black transform -translate-x-1/2 -translate-y-1/2'>
                <div className='w-2 h-2 bg-gray-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
              </div>
              <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-100 to-gray-200 rounded-b-full'></div>
            </div>
            {/* Spinning animation */}
            <div className='absolute inset-0 animate-spin'>
              <div className='w-full h-full rounded-full border-4 border-transparent border-t-yellow-400'></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Pokédex</h1>
        <p className='text-gray-600 mb-6'>
          {error ? 'Something went wrong...' : 'Loading Pokémon data...'}
        </p>

        {/* Error Message */}
        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-600 text-sm mb-3'>{error}</p>
            <div className='flex gap-2 justify-center'>
              <button
                onClick={onRetry || (() => window.location.reload())}
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm'
              >
                Try Again
              </button>
              {error.includes('quota') && onClearCache && (
                <button
                  onClick={onClearCache}
                  className='px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm'
                >
                  Clear Cache
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!error && (
          <div className='mb-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-2'>
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Messages */}
        {!error && (
          <div className='text-sm text-gray-500'>
            {progress < 20 && 'Connecting to Pokémon database...'}
            {progress >= 20 && progress < 60 && 'Downloading Pokémon data...'}
            {progress >= 60 &&
              progress < 90 &&
              'Processing Pokémon information...'}
            {progress >= 90 && progress < 100 && 'Saving to device storage...'}
            {progress >= 100 && 'Ready to explore!'}
          </div>
        )}

        {/* Fun Facts */}
        {!error && progress < 100 && (
          <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
            <p className='text-xs text-blue-600 font-medium'>Did you know?</p>
            <p className='text-xs text-blue-800 mt-1'>
              {progress < 25 &&
                'There are over 1000 different Pokémon species!'}
              {progress >= 25 &&
                progress < 50 &&
                'Pokémon can have up to two different types!'}
              {progress >= 50 &&
                progress < 75 &&
                'Some Pokémon can evolve into multiple forms!'}
              {progress >= 75 && 'This data will be saved for offline use!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
