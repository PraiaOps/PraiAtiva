/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize build settings
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Configure compiler optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize experimental features
  experimental: {
    optimizePackageImports: ['@heroicons/react', '@headlessui/react'],
    // Enable server actions
    serverActions: true,
  },
  // Configure runtime settings
  serverRuntimeConfig: {
    skipFirebaseInit: true,
  },
  publicRuntimeConfig: {
    firebaseEnabled: true,
    isDevelopment: process.env.NODE_ENV === 'development',
  },  // Configure webpack for Firebase optimization
  webpack: (config, { isServer }) => {
    // Optimize client-side Firebase imports
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase/app': 'firebase/app',
        'firebase/auth': 'firebase/auth',
        'firebase/firestore': 'firebase/firestore',
      };
    }
    // Adiciona tratamento para módulos do Firebase no servidor
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Configuração para debug de revalidação e geração de estáticos
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  staticPageGenerationTimeout: 120,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  },
}

module.exports = nextConfig 