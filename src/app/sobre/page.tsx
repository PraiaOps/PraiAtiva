'use client';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header flex flex-col justify-center">
        <div className="container mx-auto page-header-content">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Sobre o PRAIATIVA
            </h1>
            <p className="text-xl text-blue-100">
              Conectando pessoas através do esporte na praia
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nossa Missão
              </h2>
              <p className="text-gray-600 mb-6">
                O PRAIATIVA nasceu com a missão de democratizar o acesso às atividades esportivas nas praias, 
                criando uma comunidade vibrante de praticantes e instrutores apaixonados pelo esporte e pela vida ao ar livre.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Como Funcionamos
              </h2>
              <p className="text-gray-600 mb-6">
                Nossa plataforma conecta alunos a instrutores qualificados, facilitando o acesso a diversas 
                modalidades esportivas nas praias. Oferecemos um ambiente seguro e organizado para agendamento 
                de aulas e gerenciamento de atividades.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">Para Alunos</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Acesso a diversos instrutores qualificados</li>
                    <li>• Agendamento fácil de aulas</li>
                    <li>• Avaliação das atividades</li>
                    <li>• Acompanhamento do progresso</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">Para Instrutores</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Gestão simplificada de alunos</li>
                    <li>• Organização de horários</li>
                    <li>• Divulgação profissional</li>
                    <li>• Expansão da rede de contatos</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comunidade</h3>
                  <p className="text-gray-600">Construindo conexões significativas através do esporte</p>
                </div>
                <div className="text-center p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualidade</h3>
                  <p className="text-gray-600">Compromisso com a excelência no ensino e prática esportiva</p>
                </div>
                <div className="text-center p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustentabilidade</h3>
                  <p className="text-gray-600">Promovendo práticas responsáveis e respeito ao meio ambiente</p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Junte-se a Nós
              </h2>
              <p className="text-gray-600">
                Seja você um entusiasta do esporte procurando novas atividades ou um instrutor querendo expandir 
                seu alcance, o PRAIATIVA está aqui para ajudar. Faça parte desta comunidade e descubra um novo 
                jeito de vivenciar o esporte na praia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}