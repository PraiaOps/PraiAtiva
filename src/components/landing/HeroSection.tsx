'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RefObject } from 'react';

interface HeroSectionProps {
  introRef: RefObject<HTMLElement>; // Ref para Intersection Observer
  parallaxRef: RefObject<HTMLDivElement>; // Ref para o elemento com parallax
}

export default function HeroSection({ introRef, parallaxRef }: HeroSectionProps) {
  return (
    <section 
      ref={introRef} // Conectar ref para observer
      className="relative min-h-[85vh] overflow-hidden sun-section pt-16 md:pt-20" // Padding para compensar header
    >
      {/* Imagem de fundo com parallax */}
      <div 
        ref={parallaxRef} // Conectar ref para o hook controlar o transform
        className="absolute inset-0 z-0" 
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Conteúdo principal do hero */}
      <div className="container mx-auto px-4 relative z-10 min-h-[85vh] flex flex-col">
        {/* Conteúdo centralizado (Ajuste de margem superior) */}
        <div className="mt-28 md:mt-36 max-w-3xl mx-auto text-center"> {/* Reduzido mt-32/40 */} 
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Conectando atividades nas praias
          </h1>
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
        
        {/* Menu secundário na parte inferior (Espaçamento parece OK) */}
        <div className="mb-12 pb-4">
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
    </section>
  );
} 