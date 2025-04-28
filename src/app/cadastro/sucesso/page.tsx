'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CadastroSucessoPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Cadastro realizado com sucesso!
          </h2>
          
          <p className="mt-2 text-gray-600">
            Seja bem-vindo(a) ao PraiAtiva, {currentUser?.displayName || 'usuário'}!
          </p>
          
          <div className="mt-6">
            <Link 
              href="/atividades"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Explorar atividades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 