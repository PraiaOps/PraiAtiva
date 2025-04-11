'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    praiasPreferidas: [] as string[],
    atividadesFavoritas: [] as string[],
  });

  useEffect(() => {
    // Se não estiver carregando e não tiver usuário, redirecionar para login
    if (!loading && !user) {
      router.push('/login');
    }
    
    // Simular dados do usuário - em uma implementação real, isso viria do backend
    if (user) {
      setUserData({
        nome: user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
        praiasPreferidas: ['Icaraí', 'Copacabana', 'Barra da Tijuca'],
        atividadesFavoritas: ['Beach Tennis', 'Vôlei de Praia', 'Stand Up Paddle'],
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Não renderizar nada enquanto redireciona
  }

  return (
    <main className="py-16 px-4">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden max-w-4xl mx-auto">
          <div className="ocean-gradient p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-sky-700 shadow-md">
                {userData.nome.charAt(0).toUpperCase()}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {userData.nome}
                </h1>
                <p className="text-sky-100 mt-1">
                  {userData.email}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <span className="badge bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full">
                    Membro PraiAtiva
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4 text-slate-800">
                  Praias Preferidas
                </h2>
                <div className="space-y-2">
                  {userData.praiasPreferidas.map((praia, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="text-lg">🏖️</span>
                      <span>{praia}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4 text-slate-800">
                  Atividades Favoritas
                </h2>
                <div className="space-y-2">
                  {userData.atividadesFavoritas.map((atividade, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="text-lg">
                        {index === 0 ? '🎾' : index === 1 ? '🏐' : '🏄‍♂️'}
                      </span>
                      <span>{atividade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold mb-6 text-slate-800">
                Atividades Recentes
              </h2>
              
              <div className="bg-sky-50 p-6 rounded-xl text-center">
                <p className="text-slate-600">
                  Você ainda não participou de nenhuma atividade.
                  <br />
                  Explore as opções disponíveis e comece sua jornada!
                </p>
                
                <button className="mt-4 btn-primary">
                  Explorar Atividades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 