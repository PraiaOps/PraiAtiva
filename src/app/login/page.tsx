'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await signIn(email, password);
      // O redirecionamento é feito no contexto de autenticação
    } catch (error: any) {
      // O erro é tratado no contexto, mas podemos personalizar a mensagem aqui
      setErrorMessage('Email ou senha incorretos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para login rápido com usuários de teste
  const handleQuickLogin = async (userType: string) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      switch(userType) {
        case 'admin':
          await signIn('admin@praiativa.com', 'admin123');
          break;
        case 'aluno':
          await signIn('aluno@praiativa.com', 'aluno123');
          break;
        case 'instrutor':
          await signIn('instrutor@praiativa.com', 'instrutor123');
          break;
      }
    } catch (error) {
      console.error("Erro no login rápido:", error);
      setErrorMessage(`Usuário "${userType}" não encontrado ou senha incorreta.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 pt-16 pb-20 bg-slate-100 px-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="ocean-gradient p-6 sm:p-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            Bem-vindo(a) de volta!
          </h1>
          <p className="text-sky-100 mt-2">
            Acesse sua conta e continue sua jornada nas praias
          </p>
        </div>
        
        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-md">
              <p>{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input text-gray-800"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label">
                  Senha
                </label>
                <Link href="/esqueci-senha" className="text-sm text-sky-600 hover:text-sky-800 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input text-gray-800"
                placeholder="******"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center">
                  Entrar <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              )}
            </button>
          </form>
          
          {/* Botões de acesso rápido para testes */}
          <div className="mt-6 border-t pt-4 border-gray-200">
            <p className="text-sm text-slate-500 mb-2 text-center">Acesso rápido para testes:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="px-3 py-2 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                disabled={isLoading}
              >
                Entrar como Admin
              </button>
              <button
                onClick={() => handleQuickLogin('instrutor')}
                className="px-3 py-2 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                disabled={isLoading}
              >
                Entrar como Instrutor
              </button>
              <button
                onClick={() => handleQuickLogin('aluno')}
                className="px-3 py-2 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                disabled={isLoading}
              >
                Entrar como Aluno
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Ainda não tem uma conta?{' '}
              <Link href="/cadastro" className="text-sky-600 hover:text-sky-800 font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              ← Voltar para página inicial
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 