'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CalendarIcon, SparklesIcon, CheckCircleIcon, SunIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import WaveDivider from '@/components/WaveDivider';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [interesse, setInteresse] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, signOut } = useAuth();

  const [waveVisibility, setWaveVisibility] = useState<{[key: string]: boolean}>({
    qualEABoa: false,
  });
  
  const sectionRefs = {
    qualEABoa: useRef<HTMLElement>(null),
  };

  const [isHistoriaExpanded, setIsHistoriaExpanded] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setIsScrolled(scrollPosition > 20);
      
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          setWaveVisibility(prev => ({...prev, [key]: isVisible}));
        }
      });
    };
    
    setScrollY(window.scrollY);
    setIsScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, sobrenome, email, interesse });
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setNome('');
      setSobrenome('');
      setEmail('');
      setInteresse('');
    }, 3000);
  };

  const featuredActivities = [
    {
      name: 'Beach Volleyball',
      icon: '🏐',
      description: 'Torneios e aulas para todos os níveis',
      color: 'bg-amber-400'
    },
    {
      name: 'Stand Up Paddle',
      icon: '🏄‍♂️',
      description: 'Explore o mar com instrutores experientes',
      color: 'bg-sky-400'
    },
    {
      name: 'Beach Tennis',
      icon: '🎾',
      description: 'Quadras disponíveis e aulas personalizadas',
      color: 'bg-teal-400'
    },
    {
      name: 'Functional Training',
      icon: '💪',
      description: 'Treinos na areia para resultados reais',
      color: 'bg-rose-400'
    }
  ];

  const eventos = [
    {
      id: 'rio-niteroi-panam-2031',
      titulo: 'Candidatura de Rio-Niterói para Pan-Americanos 2031 é oficializada',
      data: '01 de Maio de 2025',
      categoria: 'Esporte',
      categoriaBg: 'bg-sky-100',
      categoriaText: 'text-sky-600',
      descricao: 'A candidatura conjunta de Rio de Janeiro e Niterói para sediar os Jogos Pan-Americanos de 2031 foi oficialmente aceita pela Panam Sports. A sede será escolhida em agosto.',
      imagem: '/images/eventos/PanAm-2031.png',
      linkExterno: 'https://esportes.r7.com/lance/candidatura-de-rio-niteroi-2031-e-oficializada-pela-panam-01052025/'
    },
    {
      id: 'vaario-2025',
      titulo: 'VAARIO 2025 - Campeonato Mundial de Canoa Havaiana',
      data: '13 a 21 de Agosto, 2025',
      categoria: 'Esporte',
      categoriaBg: 'bg-sky-100',
      categoriaText: 'text-sky-600',
      descricao: 'Pela primeira vez no Brasil, Niterói sedia o campeonato mundial de canoa havaiana (Va\'a) reunindo atletas de diversos países.',
      imagem: '/images/eventos/vaario2025.webp',
      linkExterno: 'https://vaario2025.com.br/'
    }
  ];

  // Determinar redirecionamento para dashboard com base no tipo de usuário
  const getDashboardLink = () => {
    const userType = userData?.role || '';
    const email = user?.email?.toLowerCase() || '';
    
    if (email === 'admin@praiativa.com' || email.includes('admin') || userType === 'admin') {
      return '/dashboard/admin';
    } else if (email.includes('instrutor') || userType === 'instrutor') {
      return '/dashboard/instrutor';
    } else {
      return '/dashboard/aluno';
    }
  };

  return (
    <>
      <main className="flex flex-col min-h-screen overflow-hidden">
        {/* Hero Section - Com design refinado */}
        <section className="relative min-h-[85vh] overflow-hidden sun-section">
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            <Image 
              src="/images/beach-hero-sunset.jpg" 
              alt="Silhuetas de pessoas praticando esportes na praia ao pôr do sol" 
              fill 
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover"
              style={{
                objectPosition: '50% 35%',
                transform: 'scale(1.1)'
              }}
            />
            
            {/* Overlay gradiente aprimorado para melhor contraste */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-sky-900/10"></div>
          </div>
          
          {/* Conteúdo principal do hero */}
          <div className="container mx-auto px-4 relative z-10 min-h-[85vh] flex flex-col">
            {/* Header com efeito glass - Com efeito de scroll */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
              <div className="container mx-auto px-4">
                <div className="h-16 flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/" className="relative flex items-center h-full z-20">
                    <div className="relative w-36 h-10">
                      <Image
                        src="/images/logo_sem_fundo.png"
                        alt="Logo PraiAtiva"
                        width={144}
                        height={40}
                        className="object-contain"
                        priority
                      />
                    </div>
                  </Link>

                  {/* Navigation Desktop */}
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Home</Link>
                    <Link href="/atividades" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Atividades</Link>
                    <Link href="/sobre" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Sobre</Link>
                    <Link href="/contato" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Contato</Link>
                  </nav>

                  {/* Auth Buttons Desktop */}
                  <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                      <>
                        <Link 
                          href={getDashboardLink()} 
                          className="text-white hover:text-blue-300 transition-colors text-sm font-medium flex items-center"
                        >
                          <div className="w-8 h-8 bg-blue-600/60 text-white rounded-full flex items-center justify-center mr-2">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span>Dashboard</span>
                        </Link>
                        <button 
                          onClick={signOut}
                          className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
                          Entrar
                        </Link>
                        <Link href="/cadastro" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
                          Cadastrar
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Mobile menu button */}
                  <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 focus:outline-none z-50"
                    aria-label="Toggle menu"
                  >
                    <div className={`w-6 h-5 flex flex-col justify-between transition-all duration-200 ${isMenuOpen ? 'justify-center' : ''}`}>
                      <span 
                        className={`block h-0.5 rounded-full transition-all duration-300 bg-white ${isMenuOpen ? 'absolute w-6 rotate-45' : 'w-6'}`}
                      ></span>
                      <span 
                        className={`block h-0.5 rounded-full transition-all duration-300 bg-white ${isMenuOpen ? 'opacity-0' : 'w-4 ml-auto'}`}
                      ></span>
                      <span 
                        className={`block h-0.5 rounded-full transition-all duration-300 bg-white ${isMenuOpen ? 'absolute w-6 -rotate-45' : 'w-6'}`}
                      ></span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Menu */}
              <div 
                className={`md:hidden fixed inset-0 top-16 transform transition-all duration-300 ease-in-out z-40 ${
                  isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                {/* Fundo sólido - Esta div garante que o fundo seja completamente preto */}
                <div className="absolute inset-0 bg-black opacity-100"></div>
                <div className="container mx-auto px-4 py-6 relative z-10">
                  <nav className="flex flex-col space-y-4 mb-8">
                    <Link href="/" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Home</Link>
                    <Link href="/atividades" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Atividades</Link>
                    <Link href="/sobre" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Sobre</Link>
                    <Link href="/contato" className="text-white hover:text-blue-300 transition-colors text-lg font-medium py-2 border-b border-white/10" onClick={toggleMenu}>Contato</Link>
                  </nav>

                  <div className="flex flex-col space-y-4">
                    {user ? (
                      <>
                        <Link 
                          href={getDashboardLink()}
                          className="text-white hover:text-blue-300 py-3 px-6 border border-white/20 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                          onClick={toggleMenu}
                        >
                          <div className="w-8 h-8 bg-blue-600/60 text-white rounded-full flex items-center justify-center">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span>Dashboard</span>
                        </Link>
                        <button 
                          onClick={() => {
                            signOut();
                            toggleMenu();
                          }}
                          className="bg-red-600/80 hover:bg-red-700 text-white text-lg font-medium py-3 px-6 rounded-lg transition-colors text-center"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/login" 
                          className="text-white hover:text-blue-300 py-3 px-6 border border-white/20 rounded-lg text-center transition-colors"
                          onClick={toggleMenu}
                        >
                          Entrar
                        </Link>
                        <Link 
                          href="/cadastro" 
                          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-6 rounded-lg transition-colors text-center"
                          onClick={toggleMenu}
                        >
                          Cadastrar
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo centralizado */}
            <div className="mt-16 md:mt-24 max-w-3xl mx-auto text-center">
              {/* Badge de lançamento */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-sm text-amber-200 text-sm font-medium mb-6 animate-pulse">
                Em breve - Seja um dos primeiros
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 drop-shadow-lg leading-tight">
                Chegou a hora dessa <span className="text-amber-400">gente bronzeada</span> mostrar seu <span className="text-sky-400">valor</span>!
              </h1>

              {/* Melhorando o contraste do texto com o fundo */}
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg md:p-6 mb-10">
                <p className="text-base md:text-lg text-blue-100 drop-shadow-md">
                  Vem aí a <span className="text-amber-400 font-semibold">1ª plataforma</span> do país que conecta você ao melhor do <span className="text-sky-400 font-semibold">esporte</span>, <span className="text-orange-400 font-semibold">turismo</span> e <span className="text-teal-400 font-semibold">lazer</span> exclusivamente nas praias!
                </p>
              </div>
              
              {/* Links de navegação apenas para desktop */}
              <div className="hidden md:flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
                <Link href="/blog" className="flex items-center text-white/90 text-sm md:text-base hover:text-sky-300 transition-colors px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Blog</span>
                </Link>
                <Link href="/tv" className="flex items-center text-white/90 text-sm md:text-base hover:text-sky-300 transition-colors px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>TV PraiAtiva</span>
                </Link>
                <Link href="/sobre" className="flex items-center text-white/90 text-sm md:text-base hover:text-sky-300 transition-colors px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Sobre nós</span>
                </Link>
                <Link href="/contato" className="flex items-center text-white/90 text-sm md:text-base hover:text-sky-300 transition-colors px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Contato</span>
                </Link>
              </div>

              {/* CTAs com melhor hierarquia */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-16">
                <Link 
                  href="/cadastro" 
                  className="group bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    Cadastre-se gratuitamente
                    <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link 
                  href="/atividades" 
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  Explorar atividades
                </Link>
              </div>
            </div>
            
            {/* Espaço flexível entre conteúdos */}
            <div className="flex-grow"></div>
          
          {/* Divisor de ondas */}
          <WaveDivider 
            position="bottom"
            primaryColor="#ffffff"
            secondaryColor="#f0f9ff"
            tertiaryColor="#e0f2fe"
          />
          </div>
        </section>
        
        {/* Seção Qual é a boa na praia - MODIFICADA */}
        <section ref={sectionRefs.qualEABoa} className="py-16 md:py-24 bg-sky-50 relative">
          <div className="container mx-auto px-4">
            {/* TEXTO MODIFICADO E ESTILIZADO COMO CARD */}
            <div className="text-center mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
              {/* Ícone Adicionado e Modificado */}
              <div className="flex justify-center mb-4">
                <SunIcon className="h-12 w-12 text-amber-500" /> {/* Trocado para SunIcon */}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sky-800">
                Se essa é sua praia, se joga!
              </h2>
              {/* Adicionado px-2 para respiro lateral em telas menores dentro do card */}
              <div className="text-lg text-slate-700 max-w-3xl mx-auto space-y-4 px-2">
                <p>
                  Crie uma rotina de vida mais ativa, saudável e integrada à natureza!
                </p>
                <p>
                  PRAIATIVA conecta quem busca a quem oferece todas as atividades de esporte, lazer e turismo exclusivamente nas praias. No seu tempo, do seu jeito, na palma de sua mão!
                </p>
                <p>
                  Autoestima, força mental e física e uma vida mais saudável, tudo isso é também uma questão de treino: precisam ser praticadas sempre.
                </p>
                <p>
                  Vamos nessa? Descubra a sua praia e se joga!
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {/* Card Atividades no Mar */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                <div className="h-48 relative overflow-hidden">
                  <Image 
                    src="/images/atividades/atividade_mar.jpg" 
                    alt="Atividades no mar"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">No mar</h3>
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-xs bg-sky-500/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        Surf
                      </span>
                      <span className="text-xs bg-sky-500/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        Stand Up Paddle
                      </span>
                      <span className="text-xs bg-sky-500/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        Natação
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-slate-600 text-sm mb-4">
                    Surf, Stand Up Paddle, Natação e mais
                  </p>
              <Link 
                    href="/atividades"
                    className="text-sky-600 hover:text-sky-700 text-sm font-medium inline-flex items-center"
              >
                    Ver atividades 
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
              {/* Card Atividades na Areia e Calçadão */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                <div className="h-48 relative overflow-hidden">
                  <Image 
                    src="/images/atividades/areia_calcadao.jpg" 
                    alt="Atividades na areia e calçadão"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-800/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">Na areia e calçadão</h3>
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-xs bg-amber-500/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        Vôlei
                      </span>
                      <span className="text-xs bg-amber-500/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        Futevôlei
                      </span>
                      <span className="text-xs bg-amber-500/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        Corrida
                      </span>
                    </div>
                    </div>
                  </div>
                <div className="p-4">
                  <p className="text-slate-600 text-sm mb-4">
                    Vôlei, Futevôlei, Corrida e mais
                  </p>
                  <Link 
                    href="/atividades"
                    className="text-sky-600 hover:text-sky-700 text-sm font-medium inline-flex items-center"
                  >
                    Ver atividades 
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                    </div>
                    </div>
                  </div>
                  
            <div className="text-center">
                <Link 
                href="/atividades" 
                className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm"
                >
                CONHEÇA TODAS AS ATIVIDADES
                <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
            </div>
              </div>
              
          {/* Seção de Eventos em Destaque */}
          <div className="container mx-auto px-4 mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-800">
                Qual é a boa?
              </h2>
            </div>

            <div className="relative">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                    centeredSlides: true,
                  },
                  1024: {
                    slidesPerView: 2,
                    centeredSlides: false,
                  },
                }}
                className="mySwiper !pb-12"
              >
                {eventos.map((evento) => (
                  <SwiperSlide key={evento.id}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full">
                      <div className="h-48 relative overflow-hidden">
                  <Image
                          src={evento.imagem}
                          alt={evento.titulo}
                          fill
                          className="object-cover transition-all hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 to-transparent"></div>
                          </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-3 py-1 ${evento.categoriaBg} ${evento.categoriaText} rounded-full text-sm font-medium`}>
                            {evento.categoria}
                          </span>
                          <span className="text-slate-600 text-sm">
                            {evento.data}
                          </span>
                      </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{evento.titulo}</h3>
                        <p className="text-slate-600 text-sm mb-4">
                          {evento.descricao}
                        </p>
                        <Link 
                          href={evento.linkExterno || `/eventos/${evento.id}`}
                          target={evento.linkExterno ? "_blank" : "_self"}
                          rel={evento.linkExterno ? "noopener noreferrer" : ""}
                          className="text-sky-600 hover:text-sky-700 text-sm font-medium inline-flex items-center"
                        >
                          Ver detalhes
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                  </div>
                </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              </div>

            <div className="text-center mt-8">
              <Link 
                href="/eventos" 
                className="inline-flex items-center bg-white text-sky-600 hover:bg-sky-50 border border-sky-200 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Ver todos os eventos
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <WaveDivider 
            position="bottom"
            primaryColor="#ffffff"
            secondaryColor="#f8fafc"
            tertiaryColor="#f1f5f9"
          />
        </section>
        
        {/* NOVA SEÇÃO: Por que escolher o PRAIATIVA? - Replicada da referência Vercel */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-800">
                Por que escolher o PRAIATIVA?
              </h2>
              <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-3xl mx-auto">
                Transpire. Inspire. Praiative-se!
              </p>
              <p className="text-slate-600 max-w-3xl mx-auto mt-4 text-lg">
                Desbloqueie o melhor da sua praia com segurança, liberdade e muito movimento. Deixe a rotina de lado e viva experiências ao ar livre — do seu jeito.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
              {/* Card 1: Economia */}
              <div className="bg-sky-50 p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl hover:scale-105">
                <div className="text-5xl mb-3">💰</div>
                <h3 className="text-4xl font-bold text-sky-700 mb-1">200%</h3>
                <p className="text-sm text-slate-800 uppercase font-semibold tracking-wider mb-2">ECONOMIA EM SAÚDE</p>
                <p className="text-xs text-slate-600">
                  Investir em atividade física pode gerar até 200% de economia em gastos com saúde a longo prazo.
                </p>
              </div>
              {/* Card 2: Saúde e Boa Forma */}
              <div className="bg-sky-50 p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl hover:scale-105">
                <div className="text-5xl mb-3">💪</div>
                <h3 className="text-4xl font-bold text-sky-700 mb-1">97%</h3>
                <p className="text-sm text-slate-800 uppercase font-semibold tracking-wider mb-2">SAÚDE E BOA FORMA</p>
                <p className="text-xs text-slate-600">
                  Dos brasileiros relacionam esportes diretamente à saúde física e mental, com benefícios comprovados.
                </p>
              </div>
              {/* Card 3: Sedentarismo */}
              <div className="bg-sky-50 p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl hover:scale-105">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-4xl font-bold text-sky-700 mb-1">60%</h3>
                <p className="text-sm text-slate-800 uppercase font-semibold tracking-wider mb-2">SEDENTARISMO</p>
                <p className="text-xs text-slate-600">
                  Dos brasileiros não praticam atividade física regularmente, aumentando em 30% o risco de desenvolver doenças.
                </p>
              </div>
              {/* Card 4: Opções em 1km */}
              <div className="bg-sky-50 p-6 rounded-xl shadow-lg text-center transition-all hover:shadow-xl hover:scale-105">
                <div className="text-5xl mb-3">🏖️</div>
                <h3 className="text-4xl font-bold text-sky-700 mb-1">500+</h3>
                <p className="text-sm text-slate-800 uppercase font-semibold tracking-wider mb-2">OPÇÕES EM 1KM</p>
                <p className="text-xs text-slate-600">
                  Mais de 500 opções de atividades esportivas em apenas 1km de praia. São 7,3 mil km de litoral para explorar!
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/cadastro" 
                className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg group"
              >
                CADASTRE-SE AGORA
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* NOVA SEÇÃO: Sobre Nós */}
        <section className="py-16 md:py-24 bg-sky-50"> {/* Fundo suave para esta seção */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-sky-800 mb-3">
                Sobre nós
              </h2>
              <p className="text-xl text-amber-600 font-semibold">
                Informar, superar e inspirar
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
              {/* A História */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-sky-700 mb-4">A história</h3>
                {/* Wrapper para o texto e o efeito de fade */}
                <div className="relative">
                  <div 
                    className={`prose prose-slate max-w-none overflow-hidden transition-all duration-500 ease-in-out ${
                      isHistoriaExpanded ? 'max-h-[2000px]' : 'max-h-48' // Aumentado max-h para melhor visualização inicial (aprox. 6-7 linhas)
                    }`}
                  >
                    <p>
                      Como praticante de vôlei de praia desde 2015, quando a ideia surgiu, já vivia as "dores" que o PRAIATIVA veio resolver: encontrar e se conectar facilmente a todas as atividades de esporte, lazer e turismo exclusivamente nas praias. O que não se consegue pela internet, nem no local, onde dependemos dos banners ao longo do calçadão, ou, com sorte, de uma indicação que dê o "match". Cansei de passar por isso.
                    </p>
                    <p>
                      Mas foi em maio de 2018 que vi que a minha história estaria para sempre conectada a do PRAIATIVA. Quando resolvi não parar com meu vôlei de praia mesmo nos períodos de quimioterapia na luta contra 3 dos 4 cânceres que tive daí até 2023. Fui me fortalecendo, física e mentalmente, embora tenha sido desenganado pelos médicos em novembro de 2021! Com a ajuda de Deus e da ciência (um tratamento revolucionário), estou em remissão total desde abril de 2023. Nunca desisti.
                    </p>
                    <p>
                      PRAIATIVA acabou se tornando parte dessa minha "missão" de tentar inspirar outros a agirem assim, na vida ou em seus projetos.
                    </p>
                    <p>
                      Por trás de cada atividade, de cada praticante, há uma história de superação. Dos que precisam vencer o sedentarismo, que tantas doenças graves, mortes e prejuízo financeiro traz a pessoas, empresas e governos. Daqueles que precisam de informação e motivação para escolher uma opção 100% no seu perfil. Dos instrutores que precisam de apoio na gestão de seu negócio na praia, o sustento da sua vida.
                    </p>
                    <p>
                      PRAIATIVA surgiu nesse ambiente, de falta de informação e necessidade de superação. E tem tudo para se fortalecer: Rio (capital) e Niterói estão juntas lutando para sediar os Panamericanos de 2031! Fomos selecionados e em abril/25 estamos iniciando o programa de incubação da Prefeitura de Niterói e Universidade Federal Fluminense (UFF). Agora, é avançar e se tornar realidade até o verão de 2025. Contamos com seu apoio! Obrigado.
                    </p>
                    <p className="font-semibold text-slate-800">
                      Paulo Peregrino - idealizador, CEO e Marketing do PRAIATIVA
                    </p>
                  </div>
                  {!isHistoriaExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>
                <button
                  onClick={() => setIsHistoriaExpanded(!isHistoriaExpanded)}
                  className="mt-4 inline-flex items-center text-sky-600 hover:text-sky-700 font-medium"
                >
                  {isHistoriaExpanded ? 'Leia menos' : 'Leia mais'}
                  {isHistoriaExpanded ? (
                    <ChevronUpIcon className="ml-1 h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-5 w-5" />
                  )}
                </button>
              </div>

              {/* A Missão */}
              <div>
                <h3 className="text-2xl font-bold text-sky-700 mb-4">A missão</h3>
                <p className="prose prose-slate max-w-none">
                  Ser uma ferramenta essencial na rotina daqueles que querem conquistar uma qualidade de vida mais ativa, preventiva e integrada à Natureza, inspirando todos na busca da saúde física, mental e social através das atividades na praia.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Botão de ação flutuante para mobile */}
        <div className="fixed right-4 bottom-4 md:hidden z-20">
          <Link 
            href="/cadastro" 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            aria-label="Cadastrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </main>
    </>
  );
}