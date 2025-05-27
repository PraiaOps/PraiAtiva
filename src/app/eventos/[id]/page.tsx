'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MapPinIcon, ShareIcon, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// Tipos de dados
interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  descricaoCompleta?: string;
  imagem: string;
  data: string;
  horario: string;
  local: string;
  categoria: string;
  link?: string;
  destaque: boolean;
  organizador?: string;
  preco?: string;
  vagas?: number;
  inscritos?: number;
  imagemPrincipal: string;
  imagens: string[];
  detalheCompleto: string;
  detalhesExtras: { titulo: string; conteudo: string }[];
  logoOrganizador?: string;
}

// Mock de dados (em produção isso seria buscado de uma API)
const eventosData: Evento[] = [
  {
    id: 1,
    titulo: 'Festa do Trabalhador',
    descricao: 'Em comemoração ao dia nacional do trabalhador, a prefeitura de Niterói realiza tradicionalmente uma grande festa com muita música e diversão para toda a família',
    descricaoCompleta: 'Em comemoração ao dia nacional do trabalhador, a prefeitura de Niterói realiza tradicionalmente uma grande festa com muita música e diversão para toda a família na Praça de Esportes João Saldanha, no bairro de Santa Bárbara, zona norte da cidade. O evento faz parte do calendário oficial de datas comemorativas do município – Lei Nº 3.474/2020. A festa conta com apresentações musicais, atividades para crianças, praça de alimentação e muito mais para celebrar esta data tão importante.',
    imagem: '/images/eventos/festa-trabalhador.png',
    data: '01 de Maio',
    horario: 'A confirmar',
    local: 'Praça de Esportes João Saldanha, Santa Bárbara, Niterói',
    categoria: 'lazer',
    link: 'https://niteroi.rj.gov.br/festa-do-trabalhador-01-05/',
    destaque: true,
    organizador: 'Prefeitura de Niterói - CGE',
    preco: 'Gratuito',
    vagas: undefined,
    inscritos: undefined,
    imagemPrincipal: '/images/eventos/festa-trabalhador.png',
    imagens: [
      '/images/eventos/festa-trabalhador.png',
      '/images/areia_calcadao.jpg',
      '/images/atividade_mar.jpg'
    ],
    detalheCompleto: `<p>A tradicional Festa do Trabalhador de Niterói ocorrerá na Praça de Esportes João Saldanha, em Santa Bárbara, oferecendo um dia de diversão, música e atividades para toda a família.</p>
    <p>O evento é uma celebração anual promovida pela Prefeitura Municipal para homenagear os trabalhadores no seu dia. A programação completa do evento ainda será divulgada, mas tradicionalmente inclui shows musicais, atividades esportivas e recreativas, além de praça de alimentação.</p>
    <p>O acesso é gratuito e aberto para toda a população.</p>`,
    detalhesExtras: [
      { titulo: 'Atrações', conteudo: 'Shows musicais, atividades recreativas, praça de alimentação' },
      { titulo: 'Acesso', conteudo: 'Gratuito' },
      { titulo: 'Informações', conteudo: 'Evento sujeito a alterações conforme condições climáticas' }
    ]
  },
  {
    id: 2,
    titulo: 'VAARIO 2025 - Campeonato Mundial de Canoa Havaiana',
    descricao: 'Pela primeira vez no Brasil, Niterói sedia o campeonato mundial de canoa havaiana (Va\\\'a) reunindo atletas de diversos países',
    descricaoCompleta: 'Niterói será palco de um evento histórico para o esporte brasileiro. Pela primeira vez, o Brasil recebe o Campeonato Mundial de Va\\\'a (Canoa Havaiana), reunindo atletas de 30 países. A competição acontecerá em Niterói, a apenas 25km do Aeroporto Internacional do Rio de Janeiro. O evento terá início com a familiarização dos atletas com o local nos dias 13 a 15 de agosto, seguido pela cerimônia de abertura no dia 15. As competições ocorrerão entre os dias 16 e 21 de agosto, com diversos dias de provas e um dia reserva caso seja necessário.',
    imagem: '/images/canoa-havaiana.jpg',
    data: '13 a 21 de Agosto, 2025',
    horario: 'Diversos horários conforme programação',
    local: 'Niterói, RJ (a 25km do Aeroporto Internacional do Rio de Janeiro)',
    categoria: 'esporte',
    link: 'https://vaario2025.com.br/',
    destaque: true,
    organizador: 'VAARIO 2025',
    preco: 'Gratuito para espectadores',
    vagas: 2000,
    inscritos: 850,
    imagemPrincipal: '/images/canoa-havaiana.jpg',
    imagens: [
      '/images/canoa-havaiana.jpg',
      '/images/atividade_mar.jpg',
      '/images/areia_calcadao.jpg'
    ],
    detalheCompleto: `<p>Niterói sediará pela primeira vez no Brasil o Campeonato Mundial de Canoa Havaiana (Va'a) em 2025. O evento reunirá competidores de mais de 25 países, sendo uma oportunidade única para os amantes deste esporte.</p>
    <p>As competições serão realizadas nas categorias individuais e equipes, abrangendo diversas distâncias e modalidades. O público terá a oportunidade de assistir às provas a partir da orla, onde também serão instaladas estruturas para transmissão ao vivo e visualização das competições.</p>
    <p>Além da competição em si, o evento contará com uma vila de exposições, onde serão apresentadas novidades sobre o esporte, equipamentos e cultura havaiana.</p>`,
    detalhesExtras: [
      { titulo: 'Categorias', conteudo: 'V1, V2, V6 e V12 em diversas distâncias' },
      { titulo: 'Inscrições', conteudo: 'Inscrições através do site oficial do evento' },
      { titulo: 'Estrutura', conteudo: 'Arquibancadas, telões, vila de exposições, praça de alimentação' }
    ]
  },
  {
    id: 3,
    titulo: 'Torneio de Beach Tennis',
    descricao: 'Participe do maior torneio de beach tennis do litoral fluminense, com categorias para todos os níveis',
    descricaoCompleta: 'O Torneio de Beach Tennis do Rio é uma competição que reúne atletas amadores e profissionais em um fim de semana de muita diversão e esporte na areia. Com categorias para todos os níveis, desde iniciantes até avançados, o torneio é uma oportunidade perfeita para praticar esse esporte que vem crescendo rapidamente no Brasil. Além das competições, haverá clínicas gratuitas para quem quer conhecer o esporte, área de alimentação e música ao vivo para criar um ambiente festivo e agradável.',
    imagem: '/images/beach-activities.jpg',
    data: '10 a 12 de Fevereiro',
    horario: '9h às 18h',
    local: 'Praia de Copacabana, Rio de Janeiro',
    categoria: 'esporte',
    link: '#',
    destaque: false,
    organizador: 'Associação Carioca de Beach Tennis',
    preco: 'R$ 120 por pessoa (competidores)',
    vagas: 150,
    inscritos: 87,
    imagemPrincipal: '/images/beach-activities.jpg',
    imagens: [
      '/images/beach-activities.jpg',
      '/images/beach-hero-sunset.jpg',
      '/images/areia_calcadao.jpg'
    ],
    detalheCompleto: `<p>O Torneio de Beach Tennis de Copacabana é um dos maiores eventos deste esporte no Brasil, reunindo atletas profissionais e amadores de várias categorias.</p>
    <p>Com estrutura profissional montada diretamente na areia, o torneio oferece uma experiência única tanto para competidores quanto para espectadores.</p>
    <p>Além das partidas, o evento contará com clínicas para iniciantes, demonstrações e área de convivência com food trucks e música ao vivo.</p>`,
    detalhesExtras: [
      { titulo: 'Categorias', conteudo: 'Profissional, Amador A/B/C, Misto, Iniciante' },
      { titulo: 'Premiação', conteudo: 'R$ 15.000 em prêmios para categorias profissionais' },
      { titulo: 'Inscrições', conteudo: 'R$ 120 por dupla (categoria amador) / R$ 200 (categoria profissional)' }
    ]
  },
  {
    id: 4,
    titulo: 'Aula aberta de Yoga na Praia',
    descricao: 'Aula de yoga gratuita para todas as idades e níveis, com instrutores qualificados e ambiente tranquilo',
    descricaoCompleta: 'Comece sua manhã de forma revigorante com uma aula de yoga ao nascer do sol na Praia do Recreio. Conduzida por instrutores experientes, a aula é aberta para todos os níveis, desde iniciantes até praticantes avançados. Traga seu tapete, uma toalha e água, e desfrute de uma experiência única de conexão com a natureza enquanto pratica posturas que fortalecem o corpo e acalmam a mente. Após a aula, haverá um momento de meditação e respiração com o som das ondas ao fundo.',
    imagem: '/images/standup.jpg',
    data: '5 de Março',
    horario: '7h às 8h30',
    local: 'Praia do Recreio, Rio de Janeiro',
    categoria: 'bem-estar',
    link: '#',
    destaque: false,
    organizador: 'Coletivo Om na Praia',
    preco: 'Gratuito',
    vagas: 80,
    inscritos: 45,
    imagemPrincipal: '/images/standup.jpg',
    imagens: [
      '/images/standup.jpg',
      '/images/beach-hero-sunset.jpg',
      '/images/beach-activities.jpg'
    ],
    detalheCompleto: `<p>Desfrute de uma manhã de yoga ao ar livre, com o som das ondas como música ambiente e a brisa do mar para refrescar.</p>
    <p>As aulas são conduzidas por professores experientes e adaptadas para todos os níveis, desde iniciantes até praticantes avançados.</p>
    <p>Traga seu tapete de yoga, água, protetor solar e vista-se com roupas leves e confortáveis. Em caso de chuva, o evento será transferido para o domingo seguinte.</p>`,
    detalhesExtras: [
      { titulo: 'O que levar', conteudo: 'Tapete de yoga, água, protetor solar, roupa confortável' },
      { titulo: 'Nível', conteudo: 'Adequado para iniciantes e avançados' },
      { titulo: 'Inscrição', conteudo: 'Gratuita, mas recomenda-se inscrição prévia pelo site' }
    ]
  },
  {
    id: 5,
    titulo: 'Sunset Beach Party',
    descricao: 'A melhor festa de pôr do sol da temporada, com DJs internacionais e ambiente descontraído',
    descricaoCompleta: 'A Sunset Beach Party é o evento mais aguardado do verão carioca. Com um line-up composto por DJs nacionais e internacionais, a festa acontece no melhor horário da praia: o pôr do sol. A partir das 16h, a música começa a tocar enquanto o sol se põe no horizonte, criando uma atmosfera mágica e única. Além da música de qualidade, o evento conta com serviço de bar com drinks especiais, área VIP e uma decoração que valoriza a beleza natural da praia de Ipanema.',
    imagem: '/images/surf.jpg',
    data: '22 de Fevereiro',
    horario: '16h às 23h',
    local: 'Praia de Ipanema, Rio de Janeiro',
    categoria: 'lazer',
    link: '#',
    destaque: false,
    organizador: 'Rio Beats Productions',
    preco: 'R$ 80 (antecipado)',
    vagas: 500,
    inscritos: 320,
    imagemPrincipal: '/images/surf.jpg',
    imagens: [
      '/images/surf.jpg',
      '/images/beach-hero-sunset.jpg',
      '/images/beach-hero-sunset.jpg'
    ],
  },
  {
    id: 6,
    titulo: 'Workshop de Fotografia de Praia',
    descricao: 'Aprenda técnicas de fotografia de paisagens litorâneas e aproveite a prática em grupo',
    descricaoCompleta: 'Apaixonado por fotografia e pela beleza das praias? Este workshop é perfeito para você! Conduzido pelo renomado fotógrafo Gabriel Mendes, especialista em fotografia de paisagens naturais, o evento combina teoria e prática em um dos cenários mais bonitos do Rio de Janeiro: a Praia Vermelha. Os participantes aprenderão técnicas específicas para capturar o movimento das ondas, a luz dourada do final da tarde, a textura da areia e composições envolvendo elementos naturais e humanos na praia.',
    imagem: '/images/kitesurf.jpg',
    data: '15 de Março',
    horario: '16h às 19h',
    local: 'Praia Vermelha, Rio de Janeiro',
    categoria: 'cultura',
    link: '#',
    destaque: false,
    organizador: 'Instituto Foto Praia',
    preco: 'R$ 150',
    vagas: 20,
    inscritos: 12,
    imagemPrincipal: '/images/kitesurf.jpg',
    imagens: [
      '/images/kitesurf.jpg',
      '/images/areia_calcadao.jpg',
      '/images/beach-hero-sunset.jpg'
    ],
  }
];

export default function EventoDetalhes({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams();
  const eventoId = parseInt(params.id);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const [inscricaoFeita, setInscricaoFeita] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  
  // Simulando busca de dados
  useEffect(() => {
    // Em produção, isso seria uma chamada para API
    const eventoEncontrado = eventosData.find(e => e.id === eventoId);
    
    // Simular tempo de carregamento
    setTimeout(() => {
      setEvento(eventoEncontrado || null);
      setLoading(false);
    }, 300);
  }, [eventoId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!evento) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Evento não encontrado</h1>
            <p className="text-gray-600 mb-6">
              O evento que você está procurando não existe ou foi removido.
            </p>
            <Link href="/eventos" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Voltar para a lista de eventos
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleInscricao = () => {
    setModalAberto(true);
  };
  
  const confirmarInscricao = () => {
    setInscricaoFeita(true);
    setModalAberto(false);
  };
  
  const vagasDisponiveis = evento.vagas && evento.inscritos 
    ? evento.vagas - evento.inscritos 
    : undefined;
  
  const percentualOcupacao = evento.vagas && evento.inscritos 
    ? (evento.inscritos / evento.vagas) * 100 
    : 0;
  
  // Eventos semelhantes (da mesma categoria)
  const eventosSemelhantes = eventosData
    .filter(ev => ev.categoria === evento.categoria && ev.id !== evento.id)
    .slice(0, 2);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative h-[60vh]">
        <div className="absolute inset-0">
          <Image 
            src={evento.imagemPrincipal}
            alt={evento.titulo}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <Link href="/eventos" className="inline-flex items-center text-white bg-blue-600 px-4 py-2 rounded-full mb-4 hover:bg-blue-700 transition-colors">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar para eventos
            </Link>
            
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4">
              {evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1)}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 max-w-4xl">
              {evento.titulo}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center text-white mt-4">
              <div className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded-full">
                <CalendarIcon className="h-4 w-4" />
                <span>{evento.data}</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded-full">
                <ClockIcon className="h-4 w-4" />
                <span>{evento.horario}</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded-full">
                <MapPinIcon className="h-4 w-4" />
                <span>{evento.local}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Conteúdo Principal */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Coluna Principal */}
            <div className="flex-grow md:w-2/3">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Sobre o evento</h2>
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: evento.detalheCompleto }}
                />
                
                {evento.link && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-2">Mais informações:</h3>
                    <a 
                      href={evento.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      {evento.link}
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mt-8">
                  <button 
                    onClick={() => setFavorito(!favorito)}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full border ${
                      favorito ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    {favorito ? (
                      <HeartSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartOutline className="h-5 w-5" />
                    )}
                    <span>
                      {favorito ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
                    </span>
                  </button>
                  
                  <button 
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ShareIcon className="h-5 w-5" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
              
              {/* Organizador */}
              {evento.organizador && (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Organizador</h2>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800">{evento.organizador}</h3>
                      <p className="text-slate-600">Organizador do evento</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver todos os eventos deste organizador
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Mapa do local (mockup) */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Localização</h2>
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image 
                    src={`https://via.placeholder.com/1000x400/CBD5E1/64748B?text=Mapa:+${encodeURIComponent(evento.local)}`}
                    alt={`Mapa: ${evento.local}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-1">{evento.local}</h3>
                  <a 
                    href={`https://www.google.com/maps/search/${encodeURIComponent(evento.local)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                  >
                    Ver no Google Maps
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Coluna lateral */}
            <div className="md:w-1/3 md:max-w-xs">
              <div className="sticky top-20">
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Detalhes</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Data</div>
                      <div className="font-medium">{evento.data}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Horário</div>
                      <div className="font-medium">{evento.horario}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Local</div>
                      <div className="font-medium">{evento.local}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Preço</div>
                      <div className="font-medium">{evento.preco || "Não informado"}</div>
                    </div>
                    {evento.vagas && (
                      <div>
                        <div className="text-sm text-slate-500 mb-1">
                          Vagas {vagasDisponiveis !== undefined ? `(${vagasDisponiveis} disponíveis)` : ""}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentualOcupacao}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {evento.inscritos}/{evento.vagas} inscritos
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Ação principal */}
                  {inscricaoFeita ? (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <svg className="h-8 w-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="font-medium text-green-800 mb-1">Inscrição confirmada!</h3>
                      <p className="text-sm text-green-600">
                        Enviamos os detalhes para o seu email.
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={handleInscricao}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">Inscrever-se</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Eventos relacionados */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Eventos semelhantes</h2>
                  <div className="space-y-4">
                    {eventosSemelhantes.map(ev => (
                      <Link href={`/eventos/${ev.id}`} key={ev.id} className="block group">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={ev.imagemPrincipal}
                              alt={ev.titulo}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {ev.titulo}
                            </h3>
                            <div className="text-xs text-slate-500 mt-1">
                              {ev.data}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal de inscrição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Confirmar inscrição</h3>
            <p className="text-slate-600 mb-6">
              Você está se inscrevendo para o evento <strong>{evento.titulo}</strong> que 
              ocorrerá em <strong>{evento.data}</strong>.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarInscricao}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}