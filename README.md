# PokéCheck - Explore Pokémon

A comprehensive, mobile-responsive PokéCheck application built with Next.js that allows users to search and explore Pokémon with detailed information, stats, moves, and evolution chains.

![PokéCheck App](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔍 **Search & Filter**

- **Smart Search**: Search Pokémon by name, type, or PokéCheck number
- **Type Filtering**: Filter by Pokémon types (Fire, Water, Grass, etc.)
- **Generation Filtering**: Browse Pokémon by generation (Gen 1-9)
- **Real-time Results**: Instant search results as you type

### 📱 **Progressive Web App (PWA)**

- **Offline Support**: Works without internet connection using Service Worker
- **Installable**: Can be installed on mobile devices and desktop
- **Mobile Optimized**: Responsive design for all screen sizes
- **App-like Experience**: Native app feel with smooth animations

### 🎮 **Pokémon Details**

- **Comprehensive Stats**: HP, Attack, Defense with visual progress bars
- **Move Information**: Quick moves, cinematic moves, and elite moves
- **Evolution Chains**: Visual evolution paths and requirements
- **High-Quality Images**: Official Pokémon artwork and sprites
- **Type Information**: Primary and secondary types with color coding

### ⚡ **Performance & Caching**

- **Smart Caching**: 24-hour localStorage cache for faster loading
- **Progress Tracking**: Loading progress indicator
- **Error Handling**: Graceful error recovery with retry options
- **Storage Management**: Automatic cache compression and quota management

### 🎨 **User Experience**

- **Modern UI**: Clean, intuitive interface with smooth animations
- **Dark/Light Theme**: Automatic theme detection
- **Accessibility**: Screen reader friendly and keyboard navigation
- **Error Boundaries**: Robust error handling throughout the app

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pokecheck
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

### **Frontend**

- **[Next.js 15.5.3](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Utility-first CSS framework

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler for development
- **[PostCSS](https://postcss.org/)** - CSS processing

### **PWA Features**

- **Service Worker** - Offline functionality and caching
- **Web App Manifest** - App installation and metadata
- **Cache API** - Intelligent data caching

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with PWA setup
│   ├── page.tsx           # Main PokéCheck page
│   ├── globals.css        # Global styles
│   └── viewport.ts        # Viewport configuration
├── components/            # React components
│   ├── ErrorBoundary.tsx  # Error handling component
│   ├── LoadingScreen.tsx  # Loading state with progress
│   ├── PokemonCard.tsx    # Individual Pokémon card
│   ├── PokemonDetail.tsx  # Detailed Pokémon modal
│   └── SearchAndFilter.tsx # Search and filter controls
├── types/                 # TypeScript type definitions
│   └── pokemon.ts         # Pokémon data types
└── utils/                 # Utility functions
    └── pokemonData.ts     # Data fetching and caching
```

## 🔧 Available Scripts

- **`npm run dev`** - Start development server with Turbopack
- **`npm run build`** - Build production application
- **`npm start`** - Start production server
- **`npm run lint`** - Run ESLint code analysis

## 🌐 Data Source

This application uses the [Pokémon GO API](https://pokemon-go-api.github.io/pokemon-go-api/) which provides:

- Complete PokéCheck data for all generations
- Pokémon stats, types, and moves
- High-quality images and sprites
- Evolution chain information

## 📱 PWA Installation

### **Mobile (iOS/Android)**

1. Open the app in your mobile browser
2. Tap the "Add to Home Screen" option
3. Follow the installation prompts

### **Desktop (Chrome/Edge)**

1. Click the install icon in the address bar
2. Or use the browser menu: "Install PokéCheck"

## 🔄 Caching Strategy

The app implements a sophisticated caching system:

- **24-hour cache duration** for Pokémon data
- **Automatic compression** to optimize storage
- **Quota management** with fallback strategies
- **Service Worker caching** for offline functionality

## 🚀 Deployment

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/pokecheck)

1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected)
3. Deploy with one click

### **Other Platforms**

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- Google Cloud Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Pokémon GO API](https://pokemon-go-api.github.io/pokemon-go-api/) for providing comprehensive Pokémon data
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- The Pokémon Company for creating the beloved franchise

---

**Built with ❤️ using Next.js and TypeScript**
