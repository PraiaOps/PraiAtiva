'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import WaveDivider from '@/components/WaveDivider';

// Estilo para ocultar o header global apenas na página inicial
export function hideDefaultHeader() {
  return (
    <style jsx global>{`
      header {
        display: none !important;
      }
      main.flex-grow.pt-16 {
        padding-top: 0 !important;
      }
    `}</style>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [interesse, setInteresse] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuFixed, setMenuFixed] = useState(false);
  const [waveVisibility, setWaveVisibility] = useState<{[key: string]: boolean}>({
    intro: false,
    qualEABoa: false,
    porQueEscolher: false,
    historia: false,
    inscricao: false
  });
  
  const sectionRefs = {
    intro: useRef<HTMLElement>(null),
    qualEABoa: useRef<HTMLElement>(null),
    porQueEscolher: useRef<HTMLElement>(null),
    historia: useRef<HTMLElement>(null),
    inscricao: useRef<HTMLElement>(null)
  };

  // Efeito de paralaxe, menu fixo e detecção de ondas no scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setMenuFixed(scrollPosition > 100);
      
      // Verificar quais seções estão visíveis para ativar as ondas
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // Se o topo da seção estiver próximo da área visível
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          setWaveVisibility(prev => ({...prev, [key]: isVisible}));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Iniciar com a verificação das ondas
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio de formulário - em um caso real, isso enviaria para uma API
    console.log({ nome, sobrenome, email, interesse });
    setEnviado(true);
    // Resetar formulário após 3 segundos
    setTimeout(() => {
      setEnviado(false);
      setNome('');
      setSobrenome('');
      setEmail('');
      setInteresse('');
    }, 3000);
  };

  return (
    <>
      {hideDefaultHeader()}
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
              sizes="100vw"
              quality={90}
              className="object-cover object-center"
            />
            
            {/* Overlay gradiente para melhorar contraste */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
          </div>
          
          {/* Header fixo ao rolar */}
          <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${menuFixed ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              {/* Logo sem fundo */}
              <div className="relative w-48 h-16 md:h-20 md:w-56 transition-all duration-300">
                <Link href="/" className="block h-full">
                  <Image 
                    src="/images/logo_sem_fundo.png" 
                    alt="PraiAtiva" 
                    width={200}
                    height={70}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </Link>
              </div>
              
              {/* Menu de navegação compacto */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Home</Link>
                <Link href="/atividades" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Atividades</Link>
                <Link href="/sobre" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Sobre</Link>
                <Link href="/contato" className="text-white font-medium hover:text-blue-300 transition-colors text-sm uppercase tracking-wide">Contato</Link>
              </nav>
              
              {/* Botões de login/cadastro */}
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
                  Entrar
                </Link>
                <Link href="/cadastro" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
                  Cadastrar
                </Link>
              </div>
            </div>
          </div>
          
          {/* Conteúdo principal do hero */}
          <div className="container mx-auto px-4 relative z-10 min-h-[85vh] flex flex-col">
            {/* Conteúdo centralizado */}
            <div className="mt-32 md:mt-40 max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Conectando atividades nas praias
              </h1>
              {/* Melhorando o contraste do texto com o fundo */}
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg md:p-6">
                <p className="text-lg md:text-2xl text-blue-100 drop-shadow-md">
                  Encontre e pratique <span className="text-yellow-300 font-semibold">centenas de atividades</span> esportivas nas praias perto de você
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
                <Link 
                  href="/atividades" 
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 sm:px-8 rounded-lg transition-colors shadow-sm"
                >
                  Explorar Atividades
                </Link>
                <Link 
                  href="/cadastro" 
                  className="bg-white hover:bg-gray-100 text-sky-700 font-medium py-3 px-6 sm:px-8 rounded-lg transition-colors shadow-sm"
                >
                  Começar Agora
                </Link>
              </div>
            </div>
            
            {/* Espaço flexível entre conteúdos */}
            <div className="flex-grow"></div>
            
            {/* Menu secundário na parte inferior */}
            <div className="mb-12 pb-4">
              {/* Links de navegação */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-white">
                <Link href="/sou-aluno" className="hover:text-sky-300 transition-colors">Sou Aluno</Link>
                <Link href="/sou-instrutor" className="hover:text-sky-300 transition-colors">Sou Instrutor</Link>
                <Link href="/sobre" className="hover:text-sky-300 transition-colors">Sobre nós</Link>
                <Link href="/eventos" className="hover:text-sky-300 transition-colors">Eventos</Link>
                <Link href="/atividades" className="hover:text-sky-300 transition-colors">Atividades</Link>
                <Link href="/contato" className="hover:text-sky-300 transition-colors">Contato</Link>
              </div>
            </div>
          </div>
          
          {/* Divider de ondas aprimorado */}
          <WaveDivider 
            position="bottom" 
            primaryColor="#0ea5e9"
            secondaryColor="#0284c7"
            tertiaryColor="#0c4a6e"
          />
        </section>
        
        {/* Seção Introdutória - Praia é sua */}
        <section ref={sectionRefs.intro} className="relative py-20 sea-section wave-container">
          <div 
            className={`wave-scroll ${waveVisibility.intro ? 'visible' : ''}`}
            style={{ top: '-100px' }}
          >
            <div className="animate-wave-up" style={{ animationDelay: '0.2s' }}>
              <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fill="#0ea5e9" 
                  fillOpacity="0.3" 
                  d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                </path>
              </svg>
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Tag/Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-sky-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm">
                  Se essa é sua praia, se joga!
                </span>
              </div>
              
              {/* Título Principal */}
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-6">
                Crie uma rotina de vida mais ativa,<br />
                saudável e integrada à natureza!
              </h2>
              
              {/* Texto Descritivo */}
              <p className="text-white text-center md:text-lg mb-12 leading-relaxed font-medium">
                PRAIATIVA conecta quem busca a quem oferece todas as atividades de esporte, lazer e turismo exclusivamente nas praias.
                No seu tempo, do seu jeito, na palma de sua mão! Autoestima, força mental e física e uma vida mais saudável,
                tudo isso é também uma questão de treino: precisam ser praticadas sempre. Vamos nessa? Descubra a sua <span className="text-yellow-300 font-bold">praia</span> e
                se joga!
              </p>
              
              {/* Benefícios do PRAIATIVA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group p-6 border-t-4 border-blue-500">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      📅
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-slate-800 text-lg">Agende & Pague</h3>
                      <p className="text-slate-600 mt-1">Aulas com um clique: seguras, organizadas e sem complicação.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group p-6 border-t-4 border-orange-500">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      🏐
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-slate-800 text-lg">500+ Atividades</h3>
                      <p className="text-slate-600 mt-1">Tudo isso em só 1km de praia! Encontre a que combina com você.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group p-6 border-t-4 border-yellow-500">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-2xl group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                      ⭐
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-slate-800 text-lg">Avaliações Reais</h3>
                      <p className="text-slate-600 mt-1">Serviços avaliados por quem vive a praia. Transparência total.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group p-6 border-t-4 border-green-500">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                      🛟
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-slate-800 text-lg">Praia mais segura</h3>
                      <p className="text-slate-600 mt-1">Profissionais verificados e atividades monitoradas para sua tranquilidade na areia e no mar.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group p-6 border-t-4 border-teal-500">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-2xl group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                      🎯
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-slate-800 text-lg">Alcance certeiro</h3>
                      <p className="text-slate-600 mt-1">Instrutores falam direto com quem quer aprender — sem intermediários, sem desperdício.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-12">
                <Link 
                  href="/cadastro" 
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 group"
                >
                  <span>QUERO PARTICIPAR</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              
              {/* Grid de Categorias */}
              <div className="rounded-lg overflow-hidden shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
                  {/* Categoria Mar */}
                  <Link 
                    href="/atividades?categoria=mar" 
                    className="relative group overflow-hidden bg-white"
                  >
                    <div className="relative pt-[75%]"> {/* Mantém proporção 4:3 */}
                      <Image 
                        src="/images/atividade_mar.jpg"
                        alt="Atividades no mar"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-700/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold text-white mb-2">no MAR</h3>
                        <p className="text-sky-100 text-sm">Surf, Stand Up Paddle, Natação e mais</p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Categoria Areia e Calçadão */}
                  <Link 
                    href="/atividades?categoria=areia" 
                    className="relative group overflow-hidden bg-white"
                  >
                    <div className="relative pt-[75%]"> {/* Mantém proporção 4:3 */}
                      <Image 
                        src="/images/areia_calcadao.jpg"
                        alt="Atividades na areia e calçadão"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-700/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold text-white mb-2">na AREIA e calçadão</h3>
                        <p className="text-amber-100 text-sm">Vôlei, Futevôlei, Corrida e mais</p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Categoria Eventos */}
                  <Link 
                    href="/eventos" 
                    className="relative group overflow-hidden bg-white"
                  >
                    <div className="relative pt-[75%]"> {/* Mantém proporção 4:3 */}
                      <Image 
                        src="/images/eventos.png"
                        alt="Eventos esportivos na praia"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-700/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold text-white mb-2">EVENTOS</h3>
                        <p className="text-teal-100 text-sm">Competições, Torneios, Aulas, Workshops e mais</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Botão Conhecer Todas as Atividades */}
                <div className="bg-sky-600 hover:bg-sky-700 transition-colors duration-300 text-center py-4">
                  <Link href="/atividades" className="inline-flex items-center gap-2 font-medium text-white">
                    <span>CONHEÇA TODAS AS ATIVIDADES</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider de ondas */}
          <WaveDivider 
            position="bottom" 
            primaryColor="#0c4a6e"
            secondaryColor="#0ea5e9"
            tertiaryColor="#0284c7"
          />
        </section>
        
        {/* Seção "Qual é a boa?" - Eventos em Destaque */}
        <section ref={sectionRefs.qualEABoa} className="relative py-16 sea-section text-white wave-container">
          <div 
            className={`wave-scroll ${waveVisibility.qualEABoa ? 'visible' : ''}`}
            style={{ top: '-120px' }}
          >
            <div className="animate-wave-up" style={{ animationDelay: '0.5s' }}>
              <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fill="#0369a1" 
                  fillOpacity="0.3" 
                  d="M0,256L48,261.3C96,267,192,277,288,245.3C384,213,480,139,576,117.3C672,96,768,128,864,160C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                </path>
              </svg>
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Título da Seção */}
              <div className="flex justify-center mb-12">
                <span className="bg-white/20 backdrop-blur-sm text-white px-8 py-2 rounded-lg text-sm font-medium shadow-sm">
                  Qual é a boa?
                </span>
              </div>
              
              {/* Cards de Eventos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Evento 1 */}
                <div className="rounded-lg overflow-hidden shadow-md bg-white/90 backdrop-blur-sm group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[16/9] w-full">
                    <Image 
                      src="/images/eventos/festa-trabalhador.png"
                      alt="Festa do Trabalhador"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-sky-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                      Lazer
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-slate-500 text-sm mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <time>01 de Maio</time>
                    </div>
                    
                    <h3 className="text-xl font-medium text-slate-800 mb-2">Festa do Trabalhador</h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      Em comemoração ao dia nacional do trabalhador, a prefeitura de Niterói realiza tradicionalmente uma grande festa com muita música e diversão para toda a família.
                    </p>
                    
                    <Link href="/eventos/1" className="text-sky-600 font-medium hover:text-sky-800 flex items-center">
                      Ver detalhes
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Evento 2 */}
                <div className="rounded-lg overflow-hidden shadow-md bg-white/90 backdrop-blur-sm group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[16/9] w-full">
                    <Image 
                      src="/images/eventos/vaario2025.webp"
                      alt="VAARIO 2025 - Campeonato Mundial de Canoa Havaiana"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: 'center top' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-sky-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                      Esporte
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-slate-500 text-sm mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <time>13 a 21 de Agosto, 2025</time>
                    </div>
                    
                    <h3 className="text-xl font-medium text-slate-800 mb-2">VAARIO 2025 - Campeonato Mundial de Canoa Havaiana</h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      Pela primeira vez no Brasil, Niterói sedia o campeonato mundial de canoa havaiana (Va'a) reunindo atletas de diversos países.
                    </p>
                    
                    <Link href="/eventos/2" className="text-sky-600 font-medium hover:text-sky-800 flex items-center">
                      Ver detalhes
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-10">
                <Link 
                  href="/eventos" 
                  className="bg-white hover:bg-white/90 text-sky-700 font-medium py-3 px-8 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 group"
                >
                  <span>Ver todos os eventos</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Divider de ondas */}
          <WaveDivider 
            position="bottom" 
            primaryColor="#0c4a6e"
            secondaryColor="#0369a1"
            tertiaryColor="#0284c7"
          />
        </section>
        
        {/* Atividades em Destaque */}
        <section ref={sectionRefs.porQueEscolher} className="relative pt-16 pb-20 sea-section text-white wave-container">
          <div 
            className={`wave-scroll ${waveVisibility.porQueEscolher ? 'visible' : ''}`}
            style={{ top: '-100px' }}
          >
            <div className="animate-wave-up" style={{ animationDelay: '0.3s' }}>
              <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fill="#0284c7" 
                  fillOpacity="0.3" 
                  d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                </path>
              </svg>
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Título da Seção */}
              <div className="flex justify-center mb-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-8 py-2 rounded-lg text-lg font-medium shadow-sm">
                  Por que escolher o PRAIATIVA?
                </span>
              </div>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Transpire. Inspire. <span className="text-yellow-300">Praiative-se!</span>
                </h2>
                <p className="text-blue-50 max-w-3xl mx-auto text-lg">
                  Desbloqueie o melhor da sua praia com segurança, liberdade e muito movimento. Deixe a rotina de lado e viva experiências ao ar livre — do seu jeito.
                </p>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Card 1 - Economia em Saúde */}
                <div className="card group hover:translate-y-[-8px] transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg">
                  <div className="h-3 bg-green-500 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 flex items-center justify-center text-3xl mb-4 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      💰
                    </div>
                    <h3 className="text-4xl font-bold mb-1 text-green-600">200<span className="text-2xl">%</span></h3>
                    <p className="text-slate-700 font-medium mb-2">ECONOMIA EM SAÚDE</p>
                    <p className="text-slate-600 text-sm">Investir em atividade física pode gerar até 200% de economia em gastos com saúde a longo prazo</p>
                  </div>
                </div>
                
                {/* Card 2 - Brasileiros e Saúde */}
                <div className="card group hover:translate-y-[-8px] transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg">
                  <div className="h-3 bg-blue-500 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 flex items-center justify-center text-3xl mb-4 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      💪
                    </div>
                    <h3 className="text-4xl font-bold mb-1 text-blue-600">97<span className="text-2xl">%</span></h3>
                    <p className="text-slate-700 font-medium mb-2">SAÚDE E BOA FORMA</p>
                    <p className="text-slate-600 text-sm">Dos brasileiros relacionam esportes diretamente à saúde física e mental, com benefícios comprovados</p>
                  </div>
                </div>
                
                {/* Card 3 - Sedentarismo */}
                <div className="card group hover:translate-y-[-8px] transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg">
                  <div className="h-3 bg-red-500 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 flex items-center justify-center text-3xl mb-4 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      ⚠️
                    </div>
                    <h3 className="text-4xl font-bold mb-1 text-red-600">60<span className="text-2xl">%</span></h3>
                    <p className="text-slate-700 font-medium mb-2">SEDENTARISMO</p>
                    <p className="text-slate-600 text-sm">Dos brasileiros não praticam atividade física regularmente, aumentando em 30% o risco de desenvolver doenças</p>
                  </div>
                </div>
                
                {/* Card 4 - Oportunidades */}
                <div className="card group hover:translate-y-[-8px] transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg">
                  <div className="h-3 bg-amber-500 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 flex items-center justify-center text-3xl mb-4 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      🏖️
                    </div>
                    <h3 className="text-4xl font-bold mb-1 text-amber-600">500<span className="text-2xl">+</span></h3>
                    <p className="text-slate-700 font-medium mb-2">OPÇÕES EM 1KM</p>
                    <p className="text-slate-600 text-sm">Mais de 500 opções de atividades esportivas em apenas 1km de praia. São 7,3 mil km de litoral para explorar!</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Link 
                  href="/cadastro" 
                  className="bg-white hover:bg-white/90 text-sky-700 font-medium py-3 px-8 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 group"
                >
                  <span>CADASTRE-SE AGORA</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Divider de ondas */}
          <WaveDivider 
            position="bottom" 
            primaryColor="#0ea5e9"
            secondaryColor="#0369a1"
            tertiaryColor="#0c4a6e"
            style={{ zIndex: 10 }}
          />
        </section>
        
        {/* História e Propósito */}
        <section ref={sectionRefs.historia} className="relative py-20 bg-gradient-to-b from-sky-600 to-amber-100 overflow-hidden wave-container">
          <div 
            className={`wave-scroll ${waveVisibility.historia ? 'visible' : ''}`}
            style={{ top: '-80px' }}
          >
            <div className="animate-wave-up" style={{ animationDelay: '0.4s' }}>
              <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fill="#0ea5e9" 
                  fillOpacity="0.3" 
                  d="M0,32L48,80C96,128,192,224,288,234.7C384,245,480,171,576,133.3C672,96,768,96,864,101.3C960,107,1056,117,1152,106.7C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                </path>
              </svg>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 lg:order-2">
                <div className="relative">
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-400/20 rounded-full filter blur-3xl opacity-70"></div>
                  <div className="absolute bottom-0 -left-4 w-72 h-72 bg-sky-400/20 rounded-full filter blur-3xl opacity-70"></div>
                  <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl">
                    <Image 
                      src="/images/atividade_mar.jpg" 
                      alt="Atividades na praia de Icaraí" 
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="rounded-2xl object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xl">
                        🏄‍♂️
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">500+ Atividades</div>
                        <div className="text-xs text-slate-500">Em 1km da praia de Icaraí</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7 lg:order-1">
                <div className="inline-flex items-center px-4 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white mb-4 text-sm font-medium">
                  <span>Nossa missão</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Competindo e se inspirando por uma vida melhor!
                </h2>
                <div className="space-y-4 text-white">
                  <p>
                    Você alguma vez já tentou achar na internet TODAS as opções de esportes para fazer na praia? É quase certo que acabou tendo que ir no local só para "caçar" informações nos banners... Ou ficou buscando indicações de alguém... 
                  </p>
                  <p className="font-medium text-amber-100">
                    Sabia que apenas em 1 km da Praia de Icaraí (Niterói/RJ), existem mais de 500 opções de atividades físicas e esportivas?
                  </p>
                  <p>
                    PRAIATIVA é a primeira plataforma que vai conectar quem busca a quem oferece atividades de esporte, lazer e turismo exclusivamente nas praias. Para você praticar sua saúde do jeito que sempre sonhou: escolhendo suas aulas e torneios aonde, por quanto, com quem, dia, horário, além de orientações e muito mais!
                  </p>
                </div>
                
                <div className="mt-8">
                  <Link 
                    href="/cadastro" 
                    className="bg-white/90 hover:bg-white text-amber-600 font-medium py-3 px-8 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 group"
                  >
                    <span>PRAIATIVE-SE!</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider de ondas */}
          <WaveDivider 
            position="bottom" 
            primaryColor="#fcd34d"
            secondaryColor="#fef3c7"
            tertiaryColor="#f59e0b"
          />
        </section>
        
        {/* Inscrição / CTA */}
        <section ref={sectionRefs.inscricao} className="relative py-20 sand-section text-slate-800 overflow-hidden wave-container">
          {/* Substituir ondas por efeito de dunas de areia */}
          <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
            <svg 
              className="w-full h-full"
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,0 C150,20 250,0 500,30 C750,60 900,40 1200,20 L1200,120 L0,120 Z" 
                className="fill-amber-300 opacity-30"
              ></path>
              <path 
                d="M0,20 C250,60 450,30 650,60 C850,90 950,70 1200,40 L1200,120 L0,120 Z" 
                className="fill-amber-500 opacity-20"
              ></path>
              <path 
                d="M0,40 C350,20 550,80 800,50 C1050,20 1150,80 1200,60 L1200,120 L0,120 Z" 
                className="fill-amber-600 opacity-10"
              ></path>
            </svg>
          </div>
          
          {/* Efeito de vento/areia se movendo */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
            {/* Substituir SVGs de ondas por padrões que lembram vento na areia */}
            <div className="absolute top-[20%] left-0 w-full h-[20px] bg-gradient-to-r from-amber-200 via-transparent to-amber-300 animate-sand-drift"></div>
            <div className="absolute top-[40%] left-0 w-full h-[15px] bg-gradient-to-r from-amber-300 via-transparent to-amber-200 animate-sand-drift-reverse" style={{animationDuration: '25s'}}></div>
            <div className="absolute top-[60%] left-0 w-full h-[25px] bg-gradient-to-r from-amber-200 via-transparent to-amber-300 animate-sand-drift" style={{animationDuration: '20s'}}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-800">
                Venha para a comunidade PRAIATIVA
              </h2>
              <p className="text-lg text-amber-900 max-w-2xl mx-auto">
                Inscreva-se e seja o primeiro a conhecer as novidades do app que vai revolucionar sua experiência nas praias!
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              {enviado ? (
                <div className="bg-amber-800/10 backdrop-blur-sm p-8 rounded-2xl text-center border border-amber-800/20 shadow-xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 text-white mb-4">
                    <svg 
                      className="w-8 h-8" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-amber-800">Formulário enviado!</h3>
                  <p className="text-amber-900">PRAIATIVA agradece o seu apoio! Em breve você receberá nossas novidades.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-amber-800/10 backdrop-blur-sm p-8 rounded-2xl border border-amber-800/20 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-amber-900 mb-1">
                        Nome
                      </label>
                      <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="sobrenome" className="block text-sm font-medium text-amber-900 mb-1">
                        Sobrenome
                      </label>
                      <input
                        id="sobrenome"
                        type="text"
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-amber-900 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="interesse" className="block text-sm font-medium text-amber-900 mb-1">
                      Seu interesse inicial
                    </label>
                    <select
                      id="interesse"
                      value={interesse}
                      onChange={(e) => setInteresse(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="praticar">Praticar atividades</option>
                      <option value="oferecer">Oferecer atividades</option>
                      <option value="conhecer">Apenas conhecer o projeto</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-300 flex items-center justify-center"
                  >
                    <span>Inscreva-se Agora</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                  
                  <p className="text-xs text-center mt-4 text-amber-900">
                    Ao se inscrever, você concorda com nossa política de privacidade.
                  </p>
                </form>
              )}
            </div>
          </div>
          
          {/* Divider de ondas */}
          <WaveDivider 
            position="bottom" 
            primaryColor="#fcd34d"
            secondaryColor="#fef3c7"
            tertiaryColor="#f59e0b"
          />
        </section>
      </main>
    </>
  );
} 