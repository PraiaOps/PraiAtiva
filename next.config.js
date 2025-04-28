const { join } = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desativar verificação de linting durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desativar verificação de TypeScript durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração para Vercel
  output: 'standalone',
  distDir: '.next',
  // Configuração experimental simplificada
  experimental: {
    optimizePackageImports: ['@heroicons/react', '@headlessui/react'],
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
  },
}

module.exports = nextConfig 