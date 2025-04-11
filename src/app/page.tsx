'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [interesse, setInteresse] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Efeito de paralaxe
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image 
            src="/images/beach-hero.jpg" 
            alt="Praia com atividades esportivas" 
            fill 
            priority
            sizes="100vw"
            quality={90}
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center 65%'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-slate-900/50 mix-blend-multiply" />
        </div>
        
        <div className="container-custom relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-orange-400/20 text-orange-100 text-sm border border-orange-400/30 backdrop-blur-sm">
                <SparklesIcon className="h-4 w-4 mr-2" />
                <span>Vem aí a plataforma que vai mudar as praias brasileiras</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight tracking-tight">
                Conecte<span className="text-orange-400">.</span>se com o <br className="hidden lg:block" />
                <span className="relative inline-block">
                  <span className="relative z-10">melhor das praias</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-sky-400/30 rounded-full -rotate-1"></span>
                </span>
              </h1>
              
              <p className="text-xl text-slate-100 mb-8 max-w-xl leading-relaxed">
                PraiAtiva conecta você a centenas de atividades esportivas e de lazer nas melhores praias. Seu estilo de vida ativo começa aqui.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/cadastro" 
                  className="btn-secondary inline-flex items-center gap-2 group"
                >
                  <span>Comece Agora</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/atividades" 
                  className="btn-outline inline-flex border-white text-white hover:bg-white hover:text-sky-600"
                >
                  Explorar Atividades
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-sm font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <span className="font-semibold">+5.000</span> usuários ativos nas praias
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl animate-float">
                <div className="absolute -top-4 -right-4 bg-orange-400 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Registre-se primeiro!
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-white text-center">
                  PraiAtiva<span className="text-orange-400">.</span>
                </h2>
                <p className="text-center mb-6 text-white/80 font-medium">
                  A 1ª plataforma que conecta você ao melhor das praias
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <span className="badge bg-sky-400/20 text-sky-100 backdrop-blur-sm px-3 py-1">Esporte</span>
                  <span className="badge bg-orange-400/20 text-orange-100 backdrop-blur-sm px-3 py-1">Lazer</span>
                  <span className="badge bg-teal-400/20 text-teal-100 backdrop-blur-sm px-3 py-1">Turismo</span>
                </div>
                
                <div className="text-sm text-center text-white/70 mb-2">
                  Lançamento oficial: 2025
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
              fill="#ffffff" 
              fillOpacity="1"
            ></path>
          </svg>
        </div>
      </section>
      
      {/* Atividades em Destaque */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Atividades em <span className="text-sky-600">Destaque</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Descubra as melhores opções de esportes e atividades disponíveis nas praias perto de você
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredActivities.map((activity, index) => (
              <div key={index} className="card group hover:translate-y-[-8px] transition-all duration-300">
                <div className={`h-3 ${activity.color} rounded-t-xl`}></div>
                <div className="p-6">
                  <div className="w-14 h-14 flex items-center justify-center text-3xl mb-4 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {activity.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{activity.name}</h3>
                  <p className="text-slate-600">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/atividades" className="btn-outline inline-flex items-center gap-2 group">
              <span>Ver todas as atividades</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefícios Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394A3B8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-sky-100 text-sky-800 mb-4 text-sm font-medium">
              <span>Por que escolher o PraiAtiva</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pratique sua saúde do jeito que sempre sonhou
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              O app que coloca você no controle da sua experiência na praia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            <div className="relative bg-white p-8 rounded-2xl shadow-soft group hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl shadow-sm group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                💪
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-3 text-slate-800">SAÚDE EM PRIMEIRO LUGAR</h3>
                <p className="text-slate-600">
                  Escolha entre centenas de atividades físicas e esportivas para melhorar sua saúde física e mental, com monitoramento de desempenho.
                </p>
              </div>
            </div>
            
            <div className="relative bg-white p-8 rounded-2xl shadow-soft group hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                ☺️
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-3 text-slate-800">BOM-HUMOR GARANTIDO</h3>
                <p className="text-slate-600">
                  Atividades divertidas e inspiradoras que combinam bem-estar com o ambiente descontraído e relaxante da praia.
                </p>
              </div>
            </div>
            
            <div className="relative bg-white p-8 rounded-2xl shadow-soft group hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-2xl shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                🙏
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-3 text-slate-800">CONEXÕES REAIS</h3>
                <p className="text-slate-600">
                  Conheça pessoas com interesses similares, faça parte de grupos e eventos exclusivos e amplie seu círculo social.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* História e Propósito */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 lg:order-2">
              <div className="relative">
                <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-400/20 rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute bottom-0 -left-4 w-72 h-72 bg-sky-400/20 rounded-full filter blur-3xl opacity-70"></div>
                <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl">
                  <Image 
                    src="/images/beach-activities.jpg" 
                    alt="Atividades na praia de Icaraí" 
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xl">
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
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-orange-100 text-orange-800 mb-4 text-sm font-medium">
                <span>Nossa missão</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Competindo e se inspirando por uma vida melhor!
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Você alguma vez já tentou achar na internet TODAS as opções de esportes para fazer na praia? É quase certo que acabou tendo que ir no local só para "caçar" informações nos banners... Ou ficou buscando indicações de alguém... 
                </p>
                <p className="font-medium text-sky-800">
                  Sabia que apenas em 1 km da Praia de Icaraí (Niterói/RJ), existem mais de 500 opções de atividades físicas e esportivas?
                </p>
                <p>
                  PRAIATIVA é a primeira plataforma que vai conectar quem busca a quem oferece atividades de esporte, lazer e turismo exclusivamente nas praias. Para você praticar sua saúde do jeito que sempre sonhou: escolhendo suas aulas e torneios aonde, por quanto, com quem, dia, horário, além de orientações e muito mais!
                </p>
              </div>
              
              <div className="mt-8">
                <Link 
                  href="/cadastro" 
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  <span>PRAIATIVE-SE!</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Inscrição / CTA */}
      <section className="py-20 relative ocean-gradient text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-[400px] left-0 w-[200%] h-auto opacity-50 animate-wave">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-[200px] left-0 w-[200%] h-auto opacity-30 animate-wave" style={{animationDuration: '20s'}}>
            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Venha para a comunidade PRAIATIVA
            </h2>
            <p className="text-lg text-sky-50 max-w-2xl mx-auto">
              Inscreva-se e seja o primeiro a conhecer as novidades do app que vai revolucionar sua experiência nas praias!
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            {enviado ? (
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/20 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-400 text-white mb-4">
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
                <h3 className="text-2xl font-bold mb-2">Formulário enviado!</h3>
                <p className="text-sky-100">PRAIATIVA agradece o seu apoio! Em breve você receberá nossas novidades.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-white mb-1">
                      Nome
                    </label>
                    <input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-white"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="sobrenome" className="block text-sm font-medium text-white mb-1">
                      Sobrenome
                    </label>
                    <input
                      id="sobrenome"
                      type="text"
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-white"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-white"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="interesse" className="block text-sm font-medium text-white mb-1">
                    Seu interesse inicial
                  </label>
                  <select
                    id="interesse"
                    value={interesse}
                    onChange={(e) => setInteresse(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-white"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="praticar">Praticar atividades</option>
                    <option value="oferecer">Oferecer atividades</option>
                    <option value="conhecer">Apenas conhecer o projeto</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg shadow-sm transition-colors duration-300 flex items-center justify-center"
                >
                  <span>Inscreva-se Agora</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
                
                <p className="text-xs text-center mt-4 text-sky-100">
                  Ao se inscrever, você concorda com nossa política de privacidade.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 