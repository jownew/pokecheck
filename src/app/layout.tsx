import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PokéCheck - Explore Pokémon',
  description:
    'A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.',
  keywords:
    'pokemon, pokecheck, pokemon go, pokemon search, pokemon stats, pokemon evolution',
  authors: [{ name: 'PokéCheck App' }],
  manifest: '/manifest.json',

  // Open Graph metadata for social sharing
  openGraph: {
    title: 'PokéCheck - Explore Pokémon',
    description:
      'A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.',
    url: 'https://pokecheck-seven.vercel.app/', // Replace with your actual domain
    siteName: 'PokéCheck',
    images: [
      {
        url: '/og-image-simple.svg', // Using SVG as fallback until PNG is created
        width: 1200,
        height: 630,
        alt: 'PokéCheck - Explore Pokémon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'PokéCheck - Explore Pokémon',
    description:
      'A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.',
    images: ['/og-image-simple.svg'], // Same image as Open Graph
    creator: '@your_twitter_handle', // Replace with your Twitter handle if you have one
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Apple Web App metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PokéCheck',
  },

  formatDetection: {
    telephone: false,
  },

  // Additional meta tags
  other: {
    'application-name': 'PokéCheck',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'PokéCheck',
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='PokéCheck' />
        <link rel='apple-touch-icon' href='/favicon.ico' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        {/* Structured Data for SEO */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              'name': 'PokéCheck',
              'description':
                'A comprehensive mobile-responsive PokéCheck app to search and explore Pokémon with detailed information, stats, moves, and evolution chains.',
              'url': 'https://pokecheck-seven.vercel.app/',
              'applicationCategory': 'GameApplication',
              'operatingSystem': 'Web Browser',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD',
              },
              'author': {
                '@type': 'Organization',
                'name': 'PokéCheck App',
              },
              'keywords':
                'pokemon, pokecheck, pokemon go, pokemon search, pokemon stats, pokemon evolution',
              'inLanguage': 'en-US',
              'isAccessibleForFree': true,
            }),
          }}
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
