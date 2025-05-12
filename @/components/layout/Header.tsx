'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
// Removido usePathname daqui, pois a lógica de transparência virá por prop
// import { useAuth } from '@/contexts/AuthContext'; // Pode ser necessário se tivermos UI de usuário no header

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Verifica o scroll inicial para definir o estado
    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const shouldShowHeaderBackground = isScrolled || mobileMenuOpen || !isHomePage;

  const headerBaseClasses = "fixed w-full z-50 transition-all duration-300 h-16";
  const headerBackgroundClasses = shouldShowHeaderBackground 
    ? "bg-black/80 backdrop-blur-md shadow-md" 
    : "bg-transparent";
  
  const iconAndTextColors = (isHomePage && !shouldShowHeaderBackground) 
    ? { icon: 'bg-white', text: 'text-white' }
    : { icon: 'bg-sky-700', text: 'text-white' };

  const finalCadastroBtnBgClass = (isHomePage && !shouldShowHeaderBackground)
    ? "bg-blue-600/80 backdrop-blur-sm"
    : "bg-blue-600";

  // Para páginas não-Home, o header sempre terá fundo escuro.
  // isScrolled afeta o padding para animação de altura.
  const headerClasses = `fixed w-full z-50 transition-all duration-300 bg-black/80 backdrop-blur-md shadow-md ${
    isScrolled ? "py-2" : "py-4"
  }`;

  return (
    <div className={`${headerBaseClasses} ${headerBackgroundClasses}`}>
      <div className="container mx-auto px-4 h-full"> 
        <div className="h-full flex items-center justify-between">
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

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`${iconAndTextColors.text} hover:text-blue-300 transition-colors text-sm font-medium`}>Home</Link>
            <Link href="/atividades" className={`${iconAndTextColors.text} hover:text-blue-300 transition-colors text-sm font-medium`}>Atividades</Link>
            <Link href="/sobre" className={`${iconAndTextColors.text} hover:text-blue-300 transition-colors text-sm font-medium`}>Sobre</Link>
            <Link href="/contato" className={`${iconAndTextColors.text} hover:text-blue-300 transition-colors text-sm font-medium`}>Contato</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className={`${iconAndTextColors.text} hover:text-blue-300 transition-colors text-sm font-medium`}>
              Entrar
            </Link>
            <Link href="/cadastro" className={`${finalCadastroBtnBgClass} hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors`}>
              Cadastrar
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-5 flex flex-col justify-between transition-all duration-200 ${mobileMenuOpen ? 'justify-center' : ''}`}>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${iconAndTextColors.icon} 
                  ${mobileMenuOpen ? 'absolute w-6 rotate-45' : 'w-6'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${iconAndTextColors.icon} 
                  ${mobileMenuOpen ? 'opacity-0' : 'w-4 ml-auto'}`}
              ></span>
              <span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${iconAndTextColors.icon} 
                  ${mobileMenuOpen ? 'absolute w-6 -rotate-45' : 'w-6'}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-lg transform transition-all duration-300 ease-in-out z-40 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
        <div className="container mx-auto px-4 py-6 relative z-10">
          <nav className="flex flex-col space-y-4 mb-8">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Home</Link>
            <Link href="/atividades" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Atividades</Link>
            <Link href="/sobre" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Sobre</Link>
            <Link href="/contato" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Contato</Link>
          </nav>

          <div className="flex flex-col space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
} 