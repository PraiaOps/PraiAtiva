'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CadastroSucessoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tipo = searchParams.get('tipo') || 'aluno';
  
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cadastro realizado com sucesso!
          </h2>
          
          {tipo === 'instrutor' ? (
            <div>
              <p className="text-gray-600 mb-6">
                Seu cadastro como instrutor foi recebido e está em análise. Entraremos em contato por e-mail assim que seu cadastro for aprovado.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Enquanto isso, você já pode explorar as atividades disponíveis na plataforma.
              </p>
            </div>
          ) : (
            <p className="text-gray-600 mb-8">
              Seu cadastro como aluno foi concluído. Você já pode começar a explorar e participar das atividades disponíveis.
            </p>
          )}
          
          <div className="flex flex-col space-y-3">
            <Link 
              href="/atividades" 
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver atividades disponíveis
            </Link>
            
            <Link 
              href="/perfil" 
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Completar meu perfil
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Redirecionando para a página inicial em {countdown} segundos...
          </p>
        </div>
      </div>
    </div>
  );
} 