'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CadastroInstrutorPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aceiteTermos, setAceiteTermos] = useState(false);
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cidade: '',
    praiaPrincipal: '',
    modalidadesEsportivas: '',
    linkRede: ''
  });

  // Lista de modalidades esportivas disponíveis
  const modalidades = [
    'Surfe',
    'Stand Up Paddle',
    'Vôlei de Praia', 
    'Futevôlei',
    'Beach Tennis',
    'Yoga',
    'Funcional',
    'Natação',
    'Corrida',
    'Canoagem',
    'Kitesurf',
    'Windsurf'
  ];

  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModalidadeToggle = (modalidade: string) => {
    setSelectedModalidades(prev => {
      if (prev.includes(modalidade)) {
        return prev.filter(m => m !== modalidade);
      } else {
        return [...prev, modalidade];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não conferem');
      setIsLoading(false);
      return;
    }

    if (!aceiteTermos) {
      setError('Você precisa aceitar os termos para continuar');
      setIsLoading(false);
      return;
    }

    if (selectedModalidades.length === 0) {
      setError('Selecione pelo menos uma modalidade esportiva');
      setIsLoading(false);
      return;
    }

    try {
      // Dados do usuário a serem salvos
      const userData = {
        nomeCompleto: formData.nomeCompleto,
        cidade: formData.cidade,
        praiaPrincipal: formData.praiaPrincipal,
        linkRede: formData.linkRede || null,
        modalidadesEsportivas: selectedModalidades,
        role: 'instrutor',
        aprovado: false, // Instrutores precisam ser aprovados pelo admin
      };
      
      // Criar usuário com autenticação e salvar dados extras
      await signUp(formData.email, formData.senha, userData);
      
      // Redirecionar para a página de sucesso
      router.push('/cadastro/sucesso?tipo=instrutor');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError(
          <span>
            Este e-mail já está sendo usado. Você deseja {' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              fazer login
            </Link>?
          </span>
        );
      } else if (error.code === 'auth/invalid-email') {
        setError('E-mail inválido.');
      } else if (error.code === 'auth/weak-password') {
        setError('A senha é muito fraca.');
      } else {
        setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="page-header flex flex-col justify-center">
        <div className="container mx-auto page-header-content">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold text-white">
              Cadastro de Instrutor
            </h2>
            <p className="mt-2 text-blue-100">
              Junte-se à comunidade PRAIATIVA como instrutor e ofereça suas atividades nas praias
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <div className="mt-1">
                  <input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    type="text"
                    required
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                  Criar senha
                </label>
                <div className="mt-1">
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                  Confirmar senha
                </label>
                <div className="mt-1">
                  <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidades esportivas que ensina
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modalidades.map((modalidade) => (
                    <div key={modalidade} className="flex items-center">
                      <input
                        id={`modalidade-${modalidade}`}
                        type="checkbox"
                        checked={selectedModalidades.includes(modalidade)}
                        onChange={() => handleModalidadeToggle(modalidade)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`modalidade-${modalidade}`} className="ml-2 text-sm text-gray-700">
                        {modalidade}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <div className="mt-1">
                    <input
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="praiaPrincipal" className="block text-sm font-medium text-gray-700">
                    Praia principal de atuação
                  </label>
                  <div className="mt-1">
                    <input
                      id="praiaPrincipal"
                      name="praiaPrincipal"
                      type="text"
                      required
                      value={formData.praiaPrincipal}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="linkRede" className="block text-sm font-medium text-gray-700">
                  Link para rede social ou portfólio (opcional)
                </label>
                <div className="mt-1">
                  <input
                    id="linkRede"
                    name="linkRede"
                    type="url"
                    placeholder="https://instagram.com/seuusuario"
                    value={formData.linkRede}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="aceiteTermos"
                    name="aceiteTermos"
                    type="checkbox"
                    checked={aceiteTermos}
                    onChange={() => setAceiteTermos(!aceiteTermos)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="aceiteTermos" className="font-medium text-gray-700">
                    Aceite de termos
                  </label>
                  <p className="text-gray-500">
                    Concordo com os <a href="/termos" className="text-blue-600 hover:text-blue-800">Termos de Uso</a> e <a href="/privacidade" className="text-blue-600 hover:text-blue-800">Política de Privacidade</a>
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Finalizando cadastro...' : 'Finalizar Cadastro'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já possui uma conta? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Faça login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 