export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 rounded-full border-4 border-sky-200"></div>
            <div className="w-16 h-16 rounded-full border-4 border-sky-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        
        <h2 className="mt-4 text-xl font-medium text-sky-700">
          Carregando...
        </h2>
        
        <p className="mt-2 text-slate-500">
          Preparando o seu momento na praia
        </p>
      </div>
    </div>
  );
} 