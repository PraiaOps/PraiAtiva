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
  const { user, signOut } = useAuth();
  
  // Verificar se está na página inicial
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Se estiver na página inicial, o Header já é controlado lá
  if (isHomePage) {
    return null;
  }

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative flex items-center h-full z-20">
            <div className="relative w-48 h-16 md:h-20 md:w-56 transition-all duration-300">
              <Image
                src="/images/logo_sem_fundo.png"
                alt="Logo PraiAtiva"
                width={200}
                height={70}
                className="object-contain drop-shadow-lg"
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
              Entrar
            </Link>
            <Link href="/cadastro" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
              Cadastrar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md focus:outline-none"
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
        className={`md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto py-4 px-4">
          <nav className="mb-6">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/sou-aluno" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sou Aluno
                </Link>
              </li>
              <li>
                <Link 
                  href="/sou-instrutor" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sou Instrutor
                </Link>
              </li>
              <li>
                <Link 
                  href="/sobre" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link 
                  href="/eventos" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link 
                  href="/atividades" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Atividades
                </Link>
              </li>
              <li>
                <Link 
                  href="/contato" 
                  className="block px-4 py-2 rounded-lg text-white hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2 text-center text-sm font-medium text-white hover:text-blue-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="w-full py-2 text-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

type NavLinkProps = {
  href: string;
  active: boolean;
  scrolled: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, scrolled, children }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`
        relative px-3 py-2 text-sm font-medium transition-all
        ${active 
          ? scrolled 
            ? 'text-sky-700 before:bg-sky-700'
            : 'text-white before:bg-white'
          : scrolled 
            ? 'text-slate-700 hover:text-sky-700' 
            : 'text-white/90 hover:text-white'
        }
      `}
    >
      {children}
    </Link>
  );
} 