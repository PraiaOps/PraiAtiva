'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

type UserProfile = {
  nomeCompleto: string;
  email: string;
  cidade: string;
  estado?: string;
  role: 'aluno' | 'instrutor' | 'admin';
  praiaPrincipal?: string;
  modalidadesEsportivas?: string[];
  linkRede?: string;
  dataCadastro: string | { seconds: number; nanoseconds: number } | Date | any;
};

export default function PerfilPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Converter dados do Firestore para garantir que timestamps sejam serializáveis
          const userData = userDoc.data();
          const convertedData = Object.keys(userData).reduce((acc, key) => {
            const value = userData[key];
            // Verificar se é um timestamp do Firestore
            if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
              acc[key] = new Date(value.seconds * 1000).toISOString();
            } else {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, any>);
          
          setProfile(convertedData as UserProfile);
        } else {
          setError('Perfil não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        setError('Erro ao carregar informações do perfil');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Erro</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Voltar para página inicial
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header flex flex-col justify-center">
        <div className="container mx-auto page-header-content">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold text-white">
              Meu Perfil
            </h2>
            <p className="mt-2 text-blue-100">
              Visualize e atualize suas informações
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                {profile.nomeCompleto.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{profile.nomeCompleto}</h3>
                <p className="text-gray-500">{profile.email}</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.role === 'aluno' 
                      ? 'bg-green-100 text-green-800' 
                      : profile.role === 'instrutor' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-purple-100 text-purple-800'
                  }`}>
                    {profile.role === 'aluno' 
                      ? 'Aluno' 
                      : profile.role === 'instrutor' 
                        ? 'Instrutor' 
                        : 'Administrador'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Informações pessoais</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Data de cadastro</p>
                  <p className="font-medium">
                    {profile.dataCadastro 
                      ? typeof profile.dataCadastro === 'string'
                        ? new Date(profile.dataCadastro).toLocaleDateString('pt-BR')
                        : typeof profile.dataCadastro === 'object' && 'seconds' in profile.dataCadastro
                          ? new Date(profile.dataCadastro.seconds * 1000).toLocaleDateString('pt-BR')
                          : profile.dataCadastro instanceof Date
                            ? profile.dataCadastro.toLocaleDateString('pt-BR')
                            : 'Data não disponível'
                      : 'Data não disponível'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p className="font-medium">{profile.cidade}{profile.estado ? `, ${profile.estado}` : ''}</p>
                </div>

                {profile.role === 'instrutor' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Praia principal</p>
                      <p className="font-medium">{profile.praiaPrincipal || 'Não informado'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Modalidades</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.modalidadesEsportivas?.map((modalidade) => (
                          <span key={modalidade} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {modalidade}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {profile.linkRede && (
                      <div>
                        <p className="text-sm text-gray-500">Link para rede social</p>
                        <a 
                          href={profile.linkRede} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {profile.linkRede}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <button
                onClick={() => router.push('/perfil/editar')}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar perfil
              </button>
              
              <button
                onClick={() => router.back()}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}