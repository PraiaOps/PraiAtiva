'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function EscolhaCadastroPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState({
    aluno: false,
    instrutor: false,
    admin: false
  });
  const [loginError, setLoginError] = useState('');
  
  // Função para login rápido com usuários predefinidos
  const handleQuickLogin = async (tipo: 'aluno' | 'instrutor' | 'admin') => {
    setLoginError('');
    setIsLoading(prev => ({ ...prev, [tipo]: true }));
    
    try {
      let email: string;
      let senha: string;
      
      switch (tipo) {
        case 'aluno':
          email = 'aluno.teste@praiatativa.com';
          senha = 'teste123';
          break;
        case 'instrutor':
          email = 'instrutor.teste@praiatativa.com';
          senha = 'teste123';
          break;
        case 'admin':
          email = 'admin@praiatativa.com';
          senha = 'admin123';
          break;
      }
      
      try {
        // Tentar fazer login diretamente 
        await signInWithEmailAndPassword(auth, email, senha);
        router.push('/');
      } catch (loginError: any) {
        // Se não existir, criar o usuário
        if (loginError.code === 'auth/user-not-found') {
          console.log(`Criando usuário de teste ${tipo}...`);
          try {
            // Criar o usuário
            await createUserWithEmailAndPassword(auth, email, senha);
            router.push('/');
          } catch (createError: any) {
            // Se não conseguir criar, mostrar mensagem específica
            if (createError.code === 'auth/email-already-in-use') {
              setLoginError(`Erro inesperado: O usuário ${tipo} existe na autenticação mas não foi encontrado. Tente novamente.`);
            } else {
              throw createError;
            }
          }
        } else if (loginError.code === 'auth/invalid-credential' || loginError.code === 'auth/wrong-password') {
          setLoginError(`Senha incorreta para o usuário de teste ${tipo}. Tente criar uma nova conta para teste.`);
        } else {
          throw loginError;
        }
      }
    } catch (error: any) {
      console.error(`Erro ao fazer login rápido como ${tipo}:`, error);
      
      // Traduzir mensagens de erro comuns
      let mensagem = error.message;
      if (error.code === 'auth/network-request-failed') {
        mensagem = 'Falha na conexão com a internet. Verifique sua conexão e tente novamente.';
      } else if (error.code === 'auth/too-many-requests') {
        mensagem = 'Muitas tentativas de login. Tente novamente mais tarde.';
      }
      
      setLoginError(`Falha no login como ${tipo}. ${mensagem}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [tipo]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="page-header flex flex-col justify-center">
        <div className="container mx-auto page-header-content">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold text-white">
              Escolha o tipo de cadastro
            </h2>
            <p className="mt-2 text-blue-100">
              Você quer se cadastrar como aluno ou instrutor na comunidade PRAIATIVA?
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
            {loginError && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {loginError}
              </div>
            )}
            
            <div className="flex flex-col space-y-6">
              <div className="border border-blue-100 p-6 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Cadastro de Aluno</h3>
                <p className="text-gray-600 mb-4">
                  Cadastre-se como aluno para participar das atividades e aulas disponíveis nas praias.
                </p>
                <ul className="mb-6 text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Reserva de atividades
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Avaliação de instrutores
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Favoritar atividades
                  </li>
                </ul>
                <Link 
                  href="/cadastro/aluno" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cadastrar como Aluno
                </Link>
              </div>
              
              <div className="border border-blue-100 p-6 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Cadastro de Instrutor</h3>
                <p className="text-gray-600 mb-4">
                  Cadastre-se como instrutor para oferecer aulas e atividades na praia.
                </p>
                <ul className="mb-6 text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Criação de atividades
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Gerenciamento de alunos
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Configuração de horários
                  </li>
                </ul>
                <Link 
                  href="/cadastro/instrutor" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cadastrar como Instrutor
                </Link>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-gray-600">Já possui uma conta?</p>
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Faça login aqui
                </Link>
              </div>
              
              {/* Botões para testes de login rápido */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Acesso rápido para testes</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Estes botões permitem fazer login com usuários pré-cadastrados para fins de teste.
                  Os usuários são criados automaticamente na primeira vez que a aplicação é carregada.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleQuickLogin('aluno')}
                    disabled={isLoading.aluno}
                    className={`text-xs py-2 px-3 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center justify-center ${
                      isLoading.aluno ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading.aluno ? (
                      <svg className="animate-spin h-4 w-4 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Login como Aluno'}
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('instrutor')}
                    disabled={isLoading.instrutor}
                    className={`text-xs py-2 px-3 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 flex items-center justify-center ${
                      isLoading.instrutor ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading.instrutor ? (
                      <svg className="animate-spin h-4 w-4 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Login como Instrutor'}
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('admin')}
                    disabled={isLoading.admin}
                    className={`text-xs py-2 px-3 bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center justify-center ${
                      isLoading.admin ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading.admin ? (
                      <svg className="animate-spin h-4 w-4 text-red-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Login como Admin'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 