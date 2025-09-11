import { Pokemon } from '@/types/pokemon';
import { siteConfig, getCanonicalUrl, getOGImageUrl } from '@/config/env';

export interface SocialMetaData {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * Generate social media metadata for the app
 */
export function getAppSocialMeta(baseUrl: string = ''): SocialMetaData {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
    image: getOGImageUrl(),
    url: baseUrl,
  };
}

/**
 * Generate social media metadata for a specific Pokémon
 */
export function getPokemonSocialMeta(
  pokemon: Pokemon,
  baseUrl: string = ''
): SocialMetaData {
  const types =
    [pokemon.primaryType.names.English, pokemon.secondaryType?.names.English]
      .filter(Boolean)
      .join(', ') || 'Unknown type';
  const stats = pokemon.stats ? `CP: ${pokemon.stats.stamina}` : '';
  const pokemonName = pokemon.names.English;

  return {
    title: `${pokemonName} - PokéCheck`,
    description: `Discover ${pokemonName} in PokéCheck! Type: ${types}. ${stats} Learn about its moves, evolution, and detailed stats.`,
    image: pokemon.assets?.image || `${baseUrl}/og-image.png`,
    url: `${baseUrl}/?pokemon=${encodeURIComponent(pokemonName.toLowerCase())}`,
  };
}

/**
 * Generate structured data for SEO
 */
export function generateStructuredData(pokemon?: Pokemon) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': siteConfig.name,
    'description': siteConfig.description,
    'url': getCanonicalUrl(),
    'applicationCategory': 'GameApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'author': {
      '@type': 'Organization',
      'name': `${siteConfig.name} App`,
    },
    'keywords':
      'pokemon, pokecheck, pokemon go, pokemon search, pokemon stats, pokemon evolution',
    'inLanguage': 'en-US',
    'isAccessibleForFree': true,
  };

  if (pokemon) {
    const pokemonName = pokemon.names.English;
    const types =
      [pokemon.primaryType.names.English, pokemon.secondaryType?.names.English]
        .filter(Boolean)
        .join(', ') || 'Unknown';

    return {
      ...baseStructuredData,
      '@type': 'Thing',
      'name': pokemonName,
      'description': `${pokemonName} is a Pokémon with type(s): ${types}`,
      'image': pokemon.assets?.image,
      'additionalType': 'https://schema.org/Game',
    };
  }

  return baseStructuredData;
}

/**
 * Generate Twitter Card metadata
 */
export function getTwitterCardMeta(pokemon?: Pokemon) {
  const baseUrl = getCanonicalUrl();

  if (pokemon) {
    const pokemonMeta = getPokemonSocialMeta(pokemon, baseUrl);
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': pokemonMeta.title,
      'twitter:description': pokemonMeta.description,
      'twitter:image': pokemonMeta.image,
      'twitter:url': pokemonMeta.url,
    };
  }

  const appMeta = getAppSocialMeta(baseUrl);
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': appMeta.title,
    'twitter:description': appMeta.description,
    'twitter:image': appMeta.image,
    'twitter:url': appMeta.url,
  };
}

/**
 * Generate dynamic OG image URL for a Pokémon (if you implement dynamic image generation)
 */
export function getDynamicOGImageUrl(baseUrl: string = ''): string {
  // This would be used with a dynamic image generation service
  // For now, return the default OG image
  return `${baseUrl}/og-image.png`;
}

/**
 * Generate platform-specific sharing URLs
 */
export function getSharingUrls(url: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
  };
}

/**
 * Generate share text for social media
 */
export function getShareText(pokemon?: Pokemon): string {
  if (pokemon) {
    const pokemonName = pokemon.names.English;
    const types =
      [pokemon.primaryType.names.English, pokemon.secondaryType?.names.English]
        .filter(Boolean)
        .join(' & ') || 'Unknown type';
    return `Check out ${pokemonName} in PokéCheck! 🎮 Type: ${types} ⚡ Explore more Pokémon at`;
  }

  return 'Explore the ultimate PokéCheck! 🎮 Search, filter, and discover Pokémon with detailed stats, moves, and evolution chains. 📱';
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share using Web Share API or fallback to platform-specific URLs
 */
export async function shareContent(
  title: string,
  text: string,
  url: string,
  fallbackPlatform?: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp'
): Promise<boolean> {
  if (isWebShareSupported()) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (error) {
      console.log('Web Share API failed:', error);
    }
  }

  // Fallback to platform-specific sharing
  if (fallbackPlatform) {
    const sharingUrls = getSharingUrls(url, text);
    window.open(
      sharingUrls[fallbackPlatform],
      '_blank',
      'width=600,height=400'
    );
    return true;
  }

  // Copy to clipboard as final fallback
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
