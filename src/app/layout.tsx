// Remover 'use client';

import './globals.css';
import type { Metadata } from 'next'; // Importar Metadata de volta
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// Remover usePathname

const inter = Inter({ subsets: ['latin'] });

// Restaurar a exportação de metadata aqui
export const metadata: Metadata = {
  title: 'PraiAtiva - Conectando atividades nas praias',
  description: 'Plataforma que conecta quem busca com quem oferece esporte, lazer e turismo nas praias',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remover pathname e isHomePage

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header /> {/* Header sem props */}
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 