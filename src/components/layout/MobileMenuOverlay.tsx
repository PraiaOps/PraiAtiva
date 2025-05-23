import { useContext } from 'react';
import { MobileMenuContext } from './MobileMenuContext';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function MobileMenuOverlay() {
  const { isMenuOpen, setIsMenuOpen } = useContext(MobileMenuContext);
  const { user, userData, signOut } = useAuth();

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

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[999]">
      {/* Overlay escuro e blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all duration-300" 
        onClick={() => setIsMenuOpen(false)}
      ></div>
      {/* Menu lateral */}
      <div className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-black/95 backdrop-blur-xl shadow-xl px-6 py-8 flex flex-col space-y-6 z-[1000] transition-transform duration-300">
        {/* Navigation Links */}
        {[
          { href: '/', label: 'Home' },
          { href: '/atividades', label: 'Atividades' },
          { href: '/sobre', label: 'Sobre' },
          { href: '/contato', label: 'Contato' }
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-white/90 hover:text-white text-xl font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className="h-px bg-white/10 my-2"></div>
        {user ? (
          <>
            <Link 
              href={getDashboardLink()}
              className="text-white/90 hover:text-white text-xl font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}  
            >
              Dashboard
            </Link>
            <button 
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
              className="text-rose-400/90 hover:text-rose-400 text-xl font-medium transition-colors text-left"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link 
              href="/login"
              className="text-white/90 hover:text-white text-xl font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link 
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium py-3 px-6 rounded-lg transition-colors text-center shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
