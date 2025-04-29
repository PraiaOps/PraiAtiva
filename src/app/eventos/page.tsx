'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CalendarIcon, MapPinIcon, TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todos');

  // Mock de eventos para exibição
  const eventos = [
    {
      id: 1,
      titulo: 'Festa do Trabalhador',
      descricao: 'Em comemoração ao dia nacional do trabalhador, a prefeitura de Niterói realiza tradicionalmente uma grande festa com muita música e diversão para toda a família',
      imagem: '/images/eventos/festa-trabalhador.png',
      data: '01 de Maio',
      horario: 'A confirmar',
      local: 'Praça de Esportes João Saldanha, Santa Bárbara, Niterói',
      categoria: 'lazer',
      link: 'https://niteroi.rj.gov.br/festa-do-trabalhador-01-05/',
      destaque: true
    },
    {
      id: 2,
      titulo: 'VAARIO 2025 - Campeonato Mundial de Canoa Havaiana',
      descricao: 'Pela primeira vez no Brasil, Niterói sedia o campeonato mundial de canoa havaiana (Va\'a) reunindo atletas de diversos países',
      imagem: '/images/eventos/vaario2025.webp',
      data: '13 a 21 de Agosto, 2025',
      horario: '8h às 17h',
      local: 'Niterói, RJ (a 25km do Aeroporto Internacional do Rio de Janeiro)',
      categoria: 'esporte',
      link: 'https://vaario2025.com.br/',
      destaque: true
    },
    {
      id: 3,
      titulo: 'Torneio de Beach Tennis',
      descricao: 'Participe do maior torneio de beach tennis do litoral fluminense, com categorias para todos os níveis',
      imagem: '/images/atividades/beach-tennis.jpg',
      data: '10 a 12 de Fevereiro',
      horario: '9h às 18h',
      local: 'Praia de Copacabana, Rio de Janeiro',
      categoria: 'esporte',
      link: '#',
      destaque: false
    },
    {
      id: 4,
      titulo: 'Aula aberta de Yoga na Praia',
      descricao: 'Aula de yoga gratuita para todas as idades e níveis, com instrutores qualificados e ambiente tranquilo',
      imagem: '/images/atividades/yoga-praia.jpg',
      data: '5 de Março',
      horario: '7h às 8h30',
      local: 'Praia do Recreio, Rio de Janeiro',
      categoria: 'bem-estar',
      link: '#',
      destaque: false
    },
    {
      id: 5,
      titulo: 'Sunset Beach Party',
      descricao: 'A melhor festa de pôr do sol da temporada, com DJs internacionais e ambiente descontraído',
      imagem: '/images/beach-hero-sunset.jpg',
      data: '22 de Fevereiro',
      horario: '16h às 23h',
      local: 'Praia de Ipanema, Rio de Janeiro',
      categoria: 'lazer',
      link: '#',
      destaque: false
    },
    {
      id: 6,
      titulo: 'Workshop de Fotografia de Praia',
      descricao: 'Aprenda técnicas de fotografia de paisagens litorâneas e aproveite a prática em grupo',
      imagem: '/images/beach-activities.jpg',
      data: '15 de Março',
      horario: '16h às 19h',
      local: 'Praia Vermelha, Rio de Janeiro',
      categoria: 'cultura',
      link: '#',
      destaque: false
    }
  ];
  
  // Filtrar eventos baseado na busca e categoria selecionada
  const eventosFiltrados = eventos.filter(evento => {
    const matchesTerm = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       evento.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       evento.local.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = selectedCategoria === 'todos' || evento.categoria === selectedCategoria;
    
    return matchesTerm && matchesCategoria;
  });
  
  // Eventos em destaque no topo
  const eventosDestaque = eventosFiltrados.filter(evento => evento.destaque);
  // Outros eventos abaixo
  const outrosEventos = eventosFiltrados.filter(evento => !evento.destaque);
  
  const categorias = [
    { id: 'todos', nome: 'Todos', cor: 'bg-gray-500' },
    { id: 'esporte', nome: 'Esporte', cor: 'bg-blue-500' },
    { id: 'cultura', nome: 'Cultura', cor: 'bg-purple-500' },
    { id: 'bem-estar', nome: 'Bem-estar', cor: 'bg-green-500' },
    { id: 'lazer', nome: 'Lazer', cor: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="page-header relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="/images/eventos.png" 
            alt="Eventos na praia"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 page-header-content">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eventos nas Praias</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Descubra os melhores eventos esportivos, culturais e de lazer nas praias do Rio de Janeiro
            </p>
            
            {/* Barra de Busca */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Buscar eventos por nome, descrição ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pr-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <div className="absolute right-4 top-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Filtro por Categorias */}
      <section className="py-6 bg-white shadow-md sticky top-16 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map(categoria => (
              <button
                key={categoria.id}
                onClick={() => setSelectedCategoria(categoria.id)}
                className={`px-4 py-2 rounded-full text-white transition-transform hover:scale-105 ${
                  selectedCategoria === categoria.id ? `${categoria.cor} ring-2 ring-offset-2 ring-${categoria.cor.replace('bg-', '')}` : categoria.cor + '/80'
                }`}
              >
                {categoria.nome}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Eventos em Destaque */}
      {eventosDestaque.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
              <span className="bg-orange-400 w-2 h-8 rounded mr-3"></span>
              Eventos em Destaque
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {eventosDestaque.map(evento => (
                <div key={evento.id} className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full group hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6 pb-3">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {evento.titulo}
                    </h3>
                  </div>
                  
                  <div className="flex-grow relative">
                    <div className="relative h-72 overflow-hidden">
                      <Image 
                        src={evento.imagem}
                        alt={evento.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sky-500 to-transparent">
                        <div className="text-white">
                          <div className="text-xs uppercase tracking-wider mb-1">Programação</div>
                          <div className="text-2xl font-bold">{evento.local.split(',')[0]}</div>
                          <div className="text-sm mt-1">{evento.data}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-slate-600 mb-4">{evento.descricao}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{evento.data}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{evento.local}</span>
                      </div>
                    </div>
                    
                    {evento.link && (
                      <div className="mt-2">
                        <a 
                          href={evento.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        >
                          Mais informações
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Outros Eventos */}
      {outrosEventos.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
              <span className="bg-sky-400 w-2 h-8 rounded mr-3"></span>
              Próximos Eventos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outrosEventos.map(evento => (
                <div key={evento.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={evento.imagem}
                      alt={evento.titulo}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                        evento.categoria === 'esporte' ? 'bg-blue-500' :
                        evento.categoria === 'cultura' ? 'bg-purple-500' :
                        evento.categoria === 'bem-estar' ? 'bg-green-500' :
                        evento.categoria === 'lazer' ? 'bg-pink-500' : 'bg-gray-500'
                      } text-white`}>
                        {evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 hover:text-blue-600 transition-colors">
                      {evento.titulo}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{evento.descricao}</p>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{evento.data}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{evento.local.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5 mt-auto">
                    <Link href={`/eventos/${evento.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                      Ver detalhes
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Seção de Cadastro de Novo Evento */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-sky-400 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <UserGroupIcon className="h-16 w-16 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl font-bold mb-4">Organizando um evento na praia?</h2>
            <p className="text-xl opacity-90 mb-8">
              Divulgue seu evento na maior plataforma de atividades praiais do Brasil
              e alcance milhares de amantes de praia.
            </p>
            <Link href="/cadastro/evento" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg">
              Cadastrar meu evento
            </Link>
          </div>
        </div>
      </section>
      
      {/* Eventos não encontrados */}
      {eventosFiltrados.length === 0 && (
        <div className="py-12 text-center">
          <div className="max-w-md mx-auto">
            <TagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600 mb-6">
              Não encontramos eventos que correspondam à sua busca. Tente alterar os filtros ou a palavra-chave.
            </p>
            <button
              onClick={() => {setSearchTerm(''); setSelectedCategoria('todos');}}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 