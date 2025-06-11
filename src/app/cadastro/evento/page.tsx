'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  PhotoIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ClientSideWrapper from '@/components/layout/ClientSideWrapper';

export default function CadastroEventoPage() {
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [local, setLocal] = useState('');
  const [preco, setPreco] = useState('');
  const [vagas, setVagas] = useState('');
  const [link, setLink] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [organizador, setOrganizador] = useState('');
  
  // Estados de validação
  const [erros, setErros] = useState<{[key: string]: string}>({});
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  // Lista de categorias disponíveis
  const categorias = [
    { id: 'esporte', nome: 'Esporte' },
    { id: 'cultura', nome: 'Cultura' },
    { id: 'bem-estar', nome: 'Bem-estar' },
    { id: 'lazer', nome: 'Lazer' },
    { id: 'competicao', nome: 'Competição' },
    { id: 'treinamento', nome: 'Treinamento' }
  ];
  
  // Handler para seleção de imagem
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Validação do formulário
  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};
    
    if (!titulo.trim()) novosErros.titulo = 'O título é obrigatório';
    if (!descricao.trim()) novosErros.descricao = 'A descrição é obrigatória';
    if (!categoria) novosErros.categoria = 'Selecione uma categoria';
    if (!dataInicio) novosErros.dataInicio = 'A data de início é obrigatória';
    if (!horarioInicio) novosErros.horarioInicio = 'O horário de início é obrigatório';
    if (!local.trim()) novosErros.local = 'O local é obrigatório';
    
    // Validações adicionais
    if (dataFim && dataInicio && new Date(dataFim) < new Date(dataInicio)) {
      novosErros.dataFim = 'A data de término deve ser posterior à data de início';
    }
    
    if (vagas && isNaN(Number(vagas))) {
      novosErros.vagas = 'O número de vagas deve ser um número válido';
    }
    
    if (link && !link.startsWith('http')) {
      novosErros.link = 'O link deve começar com http:// ou https://';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setEnviando(true);
    
    // Simulação de envio para API
    try {
      // Em produção, aqui seria uma chamada para uma API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Formulário enviado com sucesso
      setSucesso(true);
      
      // Rolar para o topo para mostrar mensagem de sucesso
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Opcional: Reset do formulário após alguns segundos
      setTimeout(() => {
        setTitulo('');
        setDescricao('');
        setCategoria('');
        setDataInicio('');
        setDataFim('');
        setHorarioInicio('');
        setHorarioFim('');
        setLocal('');
        setPreco('');
        setVagas('');
        setLink('');
        setImagem(null);
        setPreviewImagem(null);
        setOrganizador('');
        setSucesso(false);
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setErros({
        form: 'Ocorreu um erro ao enviar o formulário. Tente novamente.'
      });
    } finally {
      setEnviando(false);
    }
  };
  
  // Renderização condicional para estado de sucesso
  if (sucesso) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Evento cadastrado com sucesso!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Seu evento foi recebido e está em processo de revisão. 
                Em breve ele estará disponível na plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/eventos" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Ver todos os eventos
                </Link>
                <button 
                  onClick={() => setSucesso(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cadastrar outro evento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientSideWrapper requireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header da página */}
        <div className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Cadastre seu evento</h1>
              <p className="text-lg md:text-xl opacity-90">
                Compartilhe seus eventos relacionados às praias com toda a comunidade
              </p>
            </div>
          </div>
        </div>
        
        {/* Formulário */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Mensagem de erro geral */}
            {erros.form && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{erros.form}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações básicas */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-500 w-1 h-6 rounded mr-2"></span>
                    Informações básicas
                  </h2>
                </div>
                
                {/* Título */}
                <div className="md:col-span-2">
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                    Título do evento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      erros.titulo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Campeonato de Vôlei de Praia"
                  />
                  {erros.titulo && <p className="mt-1 text-sm text-red-600">{erros.titulo}</p>}
                </div>
                
                {/* Descrição */}
                <div className="md:col-span-2">
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={4}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      erros.descricao ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Descreva seu evento em detalhes, incluindo o que os participantes podem esperar"
                  />
                  {erros.descricao && <p className="mt-1 text-sm text-red-600">{erros.descricao}</p>}
                </div>
                
                {/* Categoria */}
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      erros.categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                  {erros.categoria && <p className="mt-1 text-sm text-red-600">{erros.categoria}</p>}
                </div>
                
                {/* Organizador */}
                <div>
                  <label htmlFor="organizador" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do organizador
                  </label>
                  <input
                    type="text"
                    id="organizador"
                    value={organizador}
                    onChange={(e) => setOrganizador(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Seu nome ou da sua organização"
                  />
                </div>
                
                {/* Data e Hora */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center mt-4">
                    <span className="bg-blue-500 w-1 h-6 rounded mr-2"></span>
                    Data e Hora
                  </h2>
                </div>
                
                {/* Data de início */}
                <div>
                  <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de início <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="dataInicio"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        erros.dataInicio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {erros.dataInicio && <p className="mt-1 text-sm text-red-600">{erros.dataInicio}</p>}
                </div>
                
                {/* Data de fim (opcional) */}
                <div>
                  <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de término <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="dataFim"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        erros.dataFim ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {erros.dataFim && <p className="mt-1 text-sm text-red-600">{erros.dataFim}</p>}
                </div>
                
                {/* Horário de início */}
                <div>
                  <label htmlFor="horarioInicio" className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de início <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="horarioInicio"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      erros.horarioInicio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {erros.horarioInicio && <p className="mt-1 text-sm text-red-600">{erros.horarioInicio}</p>}
                </div>
                
                {/* Horário de fim (opcional) */}
                <div>
                  <label htmlFor="horarioFim" className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de término <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="time"
                    id="horarioFim"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                {/* Local e Detalhes */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center mt-4">
                    <span className="bg-blue-500 w-1 h-6 rounded mr-2"></span>
                    Local e Detalhes
                  </h2>
                </div>
                
                {/* Local */}
                <div className="md:col-span-2">
                  <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-1">
                    Local <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="local"
                      value={local}
                      onChange={(e) => setLocal(e.target.value)}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        erros.local ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Praia de Copacabana, Posto 6, Rio de Janeiro"
                    />
                  </div>
                  {erros.local && <p className="mt-1 text-sm text-red-600">{erros.local}</p>}
                </div>
                
                {/* Preço */}
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="preco"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Ex: Gratuito ou R$ 50,00"
                    />
                  </div>
                </div>
                
                {/* Vagas */}
                <div>
                  <label htmlFor="vagas" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de vagas <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    id="vagas"
                    value={vagas}
                    onChange={(e) => setVagas(e.target.value)}
                    min="1"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      erros.vagas ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 50"
                  />
                  {erros.vagas && <p className="mt-1 text-sm text-red-600">{erros.vagas}</p>}
                </div>
                
                {/* Link externo */}
                <div className="md:col-span-2">
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                    Link para mais informações <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="url"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      erros.link ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: https://www.seuevento.com.br"
                  />
                  {erros.link && <p className="mt-1 text-sm text-red-600">{erros.link}</p>}
                </div>
                
                {/* Imagem */}
                <div className="md:col-span-2">
                  <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem do evento <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {previewImagem ? (
                        <div className="relative w-full max-w-lg mx-auto">
                          <Image 
                            src={previewImagem} 
                            alt="Preview" 
                            width={400}
                            height={225}
                            className="mx-auto rounded-lg object-cover"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              setImagem(null);
                              setPreviewImagem(null);
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="imagem-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Faça upload de uma imagem</span>
                              <input 
                                id="imagem-upload" 
                                name="imagem-upload" 
                                type="file" 
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImagemChange}
                              />
                            </label>
                            <p className="pl-1">ou arraste e solte</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF até 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Termos e condições */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="termos"
                      type="checkbox"
                      required
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="termos" className="font-medium text-gray-700">
                      Concordo com os termos e condições
                    </label>
                    <p className="text-gray-500">
                      Ao cadastrar este evento, você concorda com os Termos de Uso e Política de Privacidade da plataforma PraiAtiva.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Botões */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={enviando}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                    enviando ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {enviando ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Cadastrar evento"
                  )}
                </button>
                
                <Link
                  href="/eventos"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ClientSideWrapper>
  );
}