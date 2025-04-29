import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white">
      {/* Wave Pattern Top */}
      <div className="relative h-16 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 rotate-180">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold">Praiativa</span>
            </div>
            <p className="text-gray-300 mb-4">
              Conectando quem busca com quem oferece esporte, lazer e turismo nas praias.
            </p>
            <p className="text-gray-300 text-sm">
              Praia de Icaraí, Niterói/RJ - 2025
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Navegação</h3>
            <ul className="space-y-3 md:space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/atividades" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Atividades
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/#contato" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-3 md:space-y-2">
              <li>
                <Link href="/termos" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors py-1 block">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-gray-300 mb-2">
              <span className="block">Email:</span>
              <a href="mailto:contato@praiativa.com.br" className="hover:text-white transition-colors">
                contato@praiativa.com.br
              </a>
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/praiativa" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="h-6 w-6 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://facebook.com/praiativa" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg className="h-6 w-6 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="https://youtube.com/praiativa" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg className="h-6 w-6 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} PraiAtiva. Todos os direitos reservados.</p>
          <p className="mt-2">
            Desenvolvido com ♥ em Niterói, Brasil
          </p>
        </div>
      </div>
    </footer>
  );
} 