'use client';

import React from 'react';
import { Pokemon } from '@/types/pokemon';

interface SocialShareProps {
  pokemon?: Pokemon;
  url?: string;
  title?: string;
  description?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  pokemon,
  url = window.location.href,
  title,
  description,
}) => {
  const getShareData = () => {
    if (pokemon) {
      return {
        title: `${pokemon.names.English} - PokéCheck`,
        description: `Check out ${
          pokemon.names.English
        } in the PokéCheck! Type: ${
          [
            pokemon.primaryType.names.English,
            pokemon.secondaryType?.names.English,
          ]
            .filter(Boolean)
            .join(', ') || 'Unknown'
        }. ${pokemon.stats ? `CP: ${pokemon.stats.stamina}` : ''}`,
        url: url,
      };
    }

    return {
      title: title || 'PokéCheck - Explore Pokémon',
      description:
        description ||
        'A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.',
      url: url,
    };
  };

  const shareData = getShareData();

  // Type-safe detection of Web Share API without using 'any'
  const nav =
    typeof window !== 'undefined'
      ? (navigator as Navigator & {
          share?: (data: ShareData) => Promise<void>;
        })
      : undefined;
  const canNativeShare = !!(nav && typeof nav.share === 'function');

  const handleNativeShare = async () => {
    if (canNativeShare && nav?.share) {
      try {
        await nav.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    // Copy URL to clipboard as fallback
    navigator.clipboard
      .writeText(shareData.url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(() => {
        // Final fallback - show the URL
        prompt('Copy this link:', shareData.url);
      });
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.title
    )}&url=${encodeURIComponent(shareData.url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareData.url
    )}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareData.title} - ${shareData.url}`
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-lg font-semibold text-gray-800'>Share</h3>

      {/* Native share button (mobile) */}
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <span>📱</span>
          Share
        </button>
      )}

      {/* Social media buttons */}
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={shareToTwitter}
          className='flex items-center gap-2 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm'
          title='Share on Twitter'
        >
          <span>🐦</span>
          Twitter
        </button>

        <button
          onClick={shareToFacebook}
          className='flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'
          title='Share on Facebook'
        >
          <span>📘</span>
          Facebook
        </button>

        <button
          onClick={shareToLinkedIn}
          className='flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm'
          title='Share on LinkedIn'
        >
          <span>💼</span>
          LinkedIn
        </button>

        <button
          onClick={shareToWhatsApp}
          className='flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'
          title='Share on WhatsApp'
        >
          <span>💬</span>
          WhatsApp
        </button>

        <button
          onClick={fallbackShare}
          className='flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm'
          title='Copy link'
        >
          <span>🔗</span>
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
