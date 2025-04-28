'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar o erro no serviço de log
    console.error('Erro global na aplicação:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="ocean-gradient absolute top-0 left-0 w-full h-full opacity-10"></div>
          
          <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 text-rose-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-slate-800">
              Opa! Algo deu muito errado
            </h1>
            
            <p className="text-slate-600 mb-8">
              Encontramos um problema grave na aplicação. Nossa equipe técnica foi notificada e está trabalhando para resolver o problema o mais rápido possível.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Tentar novamente
              </button>
              
              <Link href="/" className="px-5 py-3 border-2 border-sky-600 text-sky-600 hover:bg-sky-50 font-medium rounded-lg transition-colors">
                Voltar para página inicial
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 