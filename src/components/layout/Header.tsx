'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, userData, signOut } = useAuth();
  
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    if (!isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); 
    }
    return () => {
      if (!isHomePage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isHomePage) {
    return null;
  }

  // Determinar redirecionamento para dashboard com base no tipo de usuário
  const getDashboardLink = () => {
    const userType = userData?.role || '';
    const email = user?.email?.toLowerCase() || '';
    
    if (email === 'admin@praiativa.com' || email.includes('admin') || userType === 'admin') {
      return '/dashboard/admin';
    } else if (email.includes('instrutor') || userType === 'instrutor') {
      return '/dashboard/instrutor';
    } else {
      return '/dashboard/aluno';
    }
  };

  const headerClasses = `fixed w-full z-50 transition-all duration-300 bg-black/80 backdrop-blur-md shadow-md`;

  return (
    <div className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative flex items-center h-full z-20">
            <div className="relative w-36 h-10">
              <Image
                src="/images/logo_sem_fundo.png"
                alt="Logo PraiAtiva"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Home</Link>
            <Link href="/atividades" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Atividades</Link>
            <Link href="/sobre" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Sobre</Link>
            <Link href="/contato" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Contato</Link>
          </nav>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href={getDashboardLink()} 
                  className="text-white hover:text-blue-300 transition-colors text-sm font-medium flex items-center"
                >
                  <div className="w-8 h-8 bg-blue-600/60 text-white rounded-full flex items-center justify-center mr-2">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={signOut}
                  className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
                  Entrar
                </Link>
                <Link href="/cadastro" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-5 flex flex-col justify-between transition-all duration-200 ${isMenuOpen ? 'justify-center' : ''}`}>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 bg-white ${isMenuOpen ? 'absolute w-6 rotate-45' : 'w-6'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 bg-white ${isMenuOpen ? 'opacity-0' : 'w-4 ml-auto'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 bg-white ${isMenuOpen ? 'absolute w-6 -rotate-45' : 'w-6'}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden fixed inset-0 top-16 transform transition-all duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Fundo sólido - Esta div garante que o fundo seja completamente preto */}
        <div className="absolute inset-0 bg-black opacity-100"></div>
        <div className="container mx-auto px-4 py-6 relative z-10">
          <nav className="flex flex-col space-y-4 mb-8">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Home</Link>
            <Link href="/atividades" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Atividades</Link>
            <Link href="/sobre" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Sobre</Link>
            <Link href="/contato" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Contato</Link>
          </nav>

          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link 
                  href={getDashboardLink()}
                  className="text-white hover:text-blue-300 py-3 px-6 border border-white/20 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                  onClick={toggleMenu}
                >
                  <div className="w-8 h-8 bg-blue-600/60 text-white rounded-full flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  className="bg-red-600/80 hover:bg-red-700 text-white text-lg font-medium py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-blue-300 py-3 px-6 border border-white/20 rounded-lg text-center transition-colors"
                  onClick={toggleMenu}
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-6 rounded-lg transition-colors text-center"
                  onClick={toggleMenu}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}