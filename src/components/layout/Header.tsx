'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4"
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className={`font-bold text-xl ${isScrolled ? 'text-sky-700' : 'text-white'}`}
          >
            <span className="flex items-center">
              PraiAtiva
              <span className="inline-block ml-1 text-orange-400 text-2xl">.</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              <li>
                <NavLink 
                  href="/" 
                  active={pathname === '/'} 
                  scrolled={isScrolled}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/atividades" 
                  active={pathname === '/atividades'} 
                  scrolled={isScrolled}
                >
                  Atividades
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/sobre" 
                  active={pathname === '/sobre'} 
                  scrolled={isScrolled}
                >
                  Sobre
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/contato" 
                  active={pathname === '/contato'} 
                  scrolled={isScrolled}
                >
                  Contato
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link 
                  href="/perfil" 
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
                    isScrolled 
                      ? 'text-sky-700 hover:bg-sky-50' 
                      : 'text-white hover:bg-white/10'
                  } transition-colors`}
                >
                  <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                </Link>
                <button 
                  onClick={signOut}
                  className={`py-2 px-4 text-sm font-medium rounded-lg ${
                    isScrolled 
                      ? 'text-rose-600 hover:bg-rose-50' 
                      : 'text-white hover:text-rose-500 hover:bg-white'
                  } transition-colors`}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`py-2 px-4 text-sm font-medium rounded-lg ${
                    isScrolled 
                      ? 'text-sky-700 hover:bg-sky-50' 
                      : 'text-white hover:bg-white/10'
                  } transition-colors`}
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className={`py-2 px-4 text-sm font-medium rounded-lg ${
                    isScrolled 
                      ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                      : 'bg-white hover:bg-gray-100 text-sky-700'
                  } transition-colors`}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-5 flex flex-col justify-between transition-all duration-200 ${isMenuOpen ? 'justify-center' : ''}`}>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-sky-700' : 'bg-white'
                } ${isMenuOpen ? 'absolute w-6 rotate-45' : 'w-6'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-sky-700' : 'bg-white'
                } ${isMenuOpen ? 'opacity-0' : 'w-4 ml-auto'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-sky-700' : 'bg-white'
                } ${isMenuOpen ? 'absolute w-6 -rotate-45' : 'w-6'}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-custom py-4">
          <nav className="mb-6">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className={`block px-4 py-2 rounded-lg ${pathname === '/' ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/atividades" 
                  className={`block px-4 py-2 rounded-lg ${pathname === '/atividades' ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Atividades
                </Link>
              </li>
              <li>
                <Link 
                  href="/sobre" 
                  className={`block px-4 py-2 rounded-lg ${pathname === '/sobre' ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link 
                  href="/contato" 
                  className={`block px-4 py-2 rounded-lg ${pathname === '/contato' ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
          
          <hr className="border-slate-200 my-4" />
          
          <div className="space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-lg font-medium">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{user.email?.split('@')[0]}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                </div>
                <Link 
                  href="/perfil" 
                  className="block w-full px-4 py-2 text-center bg-sky-50 text-sky-700 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-center bg-rose-50 text-rose-600 rounded-lg font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-full px-4 py-2.5 text-center bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="block w-full px-4 py-2.5 text-center bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
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
        relative px-4 py-2 text-sm font-medium rounded-lg transition-all
        ${active 
          ? scrolled 
            ? 'text-sky-700 before:bg-sky-700'
            : 'text-white before:bg-white'
          : scrolled 
            ? 'text-slate-700 hover:text-sky-700 hover:bg-sky-50' 
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }
        before:content-[''] before:absolute before:h-[3px] before:w-[0%] before:left-[50%] before:bottom-0 before:transition-all before:duration-300
        ${active ? 'before:w-[calc(100%-30px)] before:left-[15px]' : ''}
      `}
    >
      {children}
    </Link>
  );
} 