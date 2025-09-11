/**
 * Environment configuration for the PokéCheck app
 * Handles environment variables with fallbacks and validation
 */

// Site configuration
export const siteConfig = {
  // Base URL - automatically detects Vercel deployment URL or uses fallback
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000',

  name: process.env.NEXT_PUBLIC_SITE_NAME || 'PokéCheck',

  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.',

  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
} as const;

// Social media configuration
export const socialConfig = {
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
} as const;

// Analytics configuration (for future use)
export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
  vercelAnalyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '',
} as const;

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isVercel = !!process.env.VERCEL;

/**
 * Get the canonical URL for the site
 * Automatically handles Vercel preview deployments
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = siteConfig.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get the Open Graph image URL
 */
export function getOGImageUrl(
  imagePath: string = '/og-image-simple.svg'
): string {
  return getCanonicalUrl(imagePath);
}

/**
 * Validate required environment variables
 * Call this during build time to ensure all required vars are set
 */
export function validateEnvironment(): void {
  const requiredVars = ['NEXT_PUBLIC_SITE_URL'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0 && isProduction) {
    console.warn(
      `Warning: Missing environment variables in production: ${missingVars.join(
        ', '
      )}\n` +
        'Using fallback values. Consider setting these for optimal SEO and social sharing.'
    );
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentInfo() {
  return {
    environment: process.env.NODE_ENV,
    isProduction,
    isDevelopment,
    isVercel,
    vercelUrl: process.env.VERCEL_URL,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
    vercelGitCommitRef: process.env.VERCEL_GIT_COMMIT_REF,
  };
}

// Export all configs as a single object for convenience
export const config = {
  site: siteConfig,
  social: socialConfig,
  analytics: analyticsConfig,
  env: getEnvironmentInfo(),
} as const;
