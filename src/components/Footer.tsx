  <footer className="bg-white">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            PraiAtiva
          </h3>
          <p className="text-gray-600">
            Conectando pessoas às melhores atividades na praia.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            Links Úteis
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/atividades"
                className="text-gray-600 hover:text-orange-600"
              >
                Atividades
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className="text-gray-600 hover:text-orange-600"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="text-gray-600 hover:text-orange-600"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            Contato
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Email: contato@praiativa.com</li>
            <li>Telefone: (11) 99999-9999</li>
            <li>Endereço: São Paulo, SP</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} PraiAtiva. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer> 