'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientSideWrapper from '@/components/layout/ClientSideWrapper';

export default function CadastroSucessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <ClientSideWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto py-12 px-4">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </ClientSideWrapper>
  );
}