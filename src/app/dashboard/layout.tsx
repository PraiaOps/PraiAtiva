'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  HomeIcon, 
  UserIcon, 
  CalendarIcon, 
  UsersIcon, 
  PlusCircleIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Determinar o tipo de usuário
  const userType = userData?.role || 'aluno';
  
  // Redirecionamento se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Escutar o evento para abrir/fechar o sidebar
  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(prevState => !prevState);
    };
    
    window.addEventListener('toggle-dashboard-sidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('toggle-dashboard-sidebar', handleToggleSidebar);
    };
  }, []);

  // Configuração dos links do menu conforme o tipo de usuário
  const menuLinks = {
    admin: [
      { href: '/dashboard/admin', label: 'Painel Principal', icon: <HomeIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/admin/usuarios', label: 'Usuários', icon: <UsersIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/admin/atividades', label: 'Atividades', icon: <CalendarIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/admin/perfil', label: 'Perfil', icon: <UserIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
    ],
    instrutor: [
      { href: '/dashboard/instrutor', label: 'Atividades', icon: <HomeIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/instrutor?tab=alunos', label: 'Alunos', icon: <UsersIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/instrutor/nova-atividade', label: 'Nova Atividade', icon: <PlusCircleIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/instrutor?tab=perfil', label: 'Perfil', icon: <UserIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
    ],
    aluno: [
      { href: '/dashboard/aluno', label: 'Explorar', icon: <HomeIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/aluno?tab=inscricoes', label: 'Inscrições', icon: <CalendarIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
      { href: '/dashboard/aluno?tab=perfil', label: 'Perfil', icon: <UserIcon className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" /> },
    ]
  };

  // Determinar links do menu baseado no tipo de usuário
  const links = menuLinks[userType as keyof typeof menuLinks] || menuLinks.aluno;

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!user) {
    // Não exibe nada enquanto redireciona
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 pt-14 md:pt-16">
      {/* Overlay para mobile quando o menu estiver aberto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Menu lateral vertical - visível apenas em desktop */}
      <aside className={`
        fixed top-[56px] md:top-[64px] left-0 z-40 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)]
        w-[250px] transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:w-56 lg:min-h-[calc(100vh-64px)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${userType === 'admin' ? 'bg-gray-800' : userType === 'instrutor' ? 'bg-orange-600' : 'bg-orange-700'}
        text-white
      `}>
        <div className="p-3 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full ${
              userType === 'instrutor' ? 'bg-orange-500' : 'bg-blue-500'
            } flex items-center justify-center`}>
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium truncate text-sm">{userData?.displayName || user?.email?.split('@')[0]}</p>
              <p className="text-xs opacity-70 capitalize">{userType}</p>
            </div>
          </div>
          <button 
            className="lg:hidden h-8 w-8 p-1.5 rounded-md hover:bg-white/10 flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-2 py-3">
          {/* Links de navegação */}
          <nav className="space-y-0.5">
            {links.map((link) => {
              const isActive = pathname === link.href || 
                (pathname.includes(link.href.split('?')[0]) && 
                 (!link.href.includes('?') || pathname.includes(link.href.split('?')[1])));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-2.5 py-2.5 rounded-lg transition-colors text-sm
                    ${isActive 
                      ? 'bg-white text-gray-800 font-medium' 
                      : 'hover:bg-white/10'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <Link 
              href="/"
              className="flex items-center px-2.5 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors mt-4 text-sm"
            >
              <ArrowLeftIcon className="w-5 h-5 lg:w-4 lg:h-4 lg:mr-2" />
              <span>Voltar ao site</span>
            </Link>
          </nav>
        </div>
      </aside>
      
      {/* Conteúdo principal */}
      <main className="flex-1 max-w-full">
        {/* Botão para abrir o menu lateral em dispositivos móveis */}
        <div className="lg:hidden flex items-center px-3 py-3">
          <button
            className={`p-2 rounded-md ${
              userType === 'instrutor' ? 'bg-orange-600' : 'bg-orange-600'
            } text-white flex items-center justify-center`}
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="ml-2">Menu</span>
          </button>
        </div>
        
        {/* Conteúdo da página - com título da seção agora dentro */}
        <div className="p-3 md:p-5">
          <div className="mb-4 lg:hidden">
            <h1 className={`text-lg font-semibold ${
              userType === 'instrutor' ? 'text-orange-800' : 'text-blue-800'
            }`}>
              {(() => {
                if (pathname.includes('inscricoes')) return 'Minhas Inscrições';
                if (pathname.includes('perfil')) return 'Meu Perfil';
                if (pathname.includes('alunos')) return 'Meus Alunos';
                if (pathname.includes('nova-atividade')) return 'Nova Atividade';
                if (pathname.includes('admin')) return 'Painel Administrativo';
                if (pathname.includes('instrutor')) return 'Painel do Instrutor';
                if (pathname.includes('aluno')) return 'Painel do Aluno';
                return 'Dashboard';
              })()}
            </h1>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
} 