'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MobileMenuContext } from './MobileMenuContext';

export default function Header() {
  const { isMenuOpen, setIsMenuOpen } = useContext(MobileMenuContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, userData, signOut } = useAuth();
  
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll(); // Check initial scroll
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine dashboard redirect based on user role
  const getDashboardLink = () => {
    if (!userData) return '/dashboard/aluno';
    switch (userData.role) {
      case 'admin': return '/dashboard/admin';
      case 'instructor': return '/dashboard/instrutor';
      case 'entrepreneur': return '/dashboard/empreendedor';
      default: return '/dashboard/aluno';
    }
  };

  // Dynamic header classes
  const headerBaseClasses = "fixed w-full z-50 transition-all duration-300";
  const headerBgClasses = (isHomePage && !isScrolled && !isMenuOpen)
    ? 'bg-transparent' 
    : 'bg-black/80 backdrop-blur-md shadow-md';
  const headerPaddingClasses = isScrolled ? "py-2" : "py-4";

  return (
    <header className={`${headerBaseClasses} ${headerBgClasses} ${headerPaddingClasses}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
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
            {[
              { href: '/', label: 'Home' },
              { href: '/atividades', label: 'Atividades' },
              { href: '/sobre', label: 'Sobre' },
              { href: '/contato', label: 'Contato' }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-white/90 font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide
                  ${pathname === href ? 'text-white' : ''}
                `}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href={getDashboardLink()} 
                  className="text-white/90 hover:text-blue-300 transition-colors text-sm font-medium flex items-center"
                >
                  <div className="w-8 h-8 bg-blue-600/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center mr-2">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={signOut}
                  className="text-white/90 hover:text-rose-400 transition-colors text-sm font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-white/90 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro"
                  className="bg-blue-600/90 backdrop-blur-sm hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`md:hidden p-2.5 focus:outline-none rounded-lg transition-all duration-300
              ${isMenuOpen ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-5 flex flex-col justify-between transition-all duration-200 ${isMenuOpen ? 'justify-center' : ''}`}>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 bg-white 
                  ${isMenuOpen ? 'absolute w-6 rotate-45' : 'w-6'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 bg-white 
                  ${isMenuOpen ? 'opacity-0' : 'w-4 ml-auto'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 bg-white 
                  ${isMenuOpen ? 'absolute w-6 -rotate-45' : 'w-6'}`}
              ></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}