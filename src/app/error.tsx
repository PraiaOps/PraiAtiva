'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar o erro no serviço de log
    console.error('Erro na aplicação:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="ocean-gradient absolute top-0 left-0 w-full h-full -z-10 opacity-10"></div>
      
      <div className="text-center max-w-md mx-auto p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
          Algo deu errado!
        </h1>
        
        <p className="text-slate-600 mb-8">
          Ocorreu um erro inesperado ao processar sua solicitação. Nossa equipe foi notificada.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto"
          >
            Tentar novamente
          </button>
          
          <Link href="/" className="btn-outline w-full sm:w-auto text-center">
            Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 