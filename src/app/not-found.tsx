import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="ocean-gradient absolute top-0 left-0 w-full h-full -z-10 opacity-10"></div>
      
      <div className="text-center max-w-md mx-auto p-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 mb-6">
          <span className="text-4xl font-bold">404</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
          Página não encontrada
        </h1>
        
        <p className="text-slate-600 mb-8">
          Oops! Parece que a página que você está procurando foi levada pela maré. Vamos voltar para águas conhecidas?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary w-full sm:w-auto text-center">
            Voltar para a praia
          </Link>
          
          <Link href="/atividades" className="btn-outline w-full sm:w-auto text-center">
            Explorar atividades
          </Link>
        </div>
        
        <div className="mt-12 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-slate-500">Ou explore outras opções</span>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/login" className="text-sky-600 hover:text-sky-800 text-sm font-medium px-3 py-1 bg-sky-50 rounded-full">
            Login
          </Link>
          <Link href="/cadastro" className="text-sky-600 hover:text-sky-800 text-sm font-medium px-3 py-1 bg-sky-50 rounded-full">
            Cadastro
          </Link>
          <Link href="/contato" className="text-sky-600 hover:text-sky-800 text-sm font-medium px-3 py-1 bg-sky-50 rounded-full">
            Contato
          </Link>
        </div>
      </div>
    </div>
  );
} 