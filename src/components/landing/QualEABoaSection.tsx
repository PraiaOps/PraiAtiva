'use client';

import { RefObject } from 'react';
import WaveDivider from '@/components/WaveDivider';
import Image from 'next/image';
import Link from 'next/link';

interface QualEABoaSectionProps {
  sectionRef: RefObject<HTMLElement>;
  isVisible: boolean; // Para animar a onda
}

export default function QualEABoaSection({ sectionRef, isVisible }: QualEABoaSectionProps) {
  return (
    // Reduzindo espaçamento vertical py-16 md:py-24 para py-16 md:py-20
    <section ref={sectionRef} className="py-16 md:py-20 bg-sky-50 relative wave-container">
      {/* Divisor de Ondas no Topo */}
      <WaveDivider 
        position="top" 
        primaryColor="#f0f9ff"
        secondaryColor="#e0f2fe"
        tertiaryColor="#bae6fd"
        animate={isVisible} // Controlar animação
      />
      
      <div className="container mx-auto px-4">
        {/* Reduzindo margem inferior do título mb-12 md:mb-16 para mb-10 md:mb-12 */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-800">
            Qual é a boa na praia?
          </h2>
          <p className="text-lg text-sky-700 max-w-3xl mx-auto">
            Descubra um universo de possibilidades para movimentar o corpo e a mente com o pé na areia.
          </p>
        </div>
        
        {/* Grid de Atividades (gap-6 md:gap-8 parece razoável) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Card de Atividade 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-sky-100">
            <Image 
              src="/images/icon-esportes.svg" 
              alt="Ícone de Esportes Coletivos" 
              width={50} 
              height={50} 
              className="mb-4" 
              style={{ height: 'auto' }}
            />
            <h3 className="text-xl font-semibold mb-2 text-sky-900">Esportes Coletivos</h3>
            <p className="text-sky-700 text-sm">Futevôlei, Beach Tennis, Vôlei de Praia e mais. Encontre sua turma e jogue!</p>
          </div>
          
          {/* Card de Atividade 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-sky-100">
            <Image 
              src="/images/icon-bem-estar.svg" 
              alt="Ícone de Bem-Estar" 
              width={50} 
              height={50} 
              className="mb-4" 
              style={{ height: 'auto' }}
            />
            <h3 className="text-xl font-semibold mb-2 text-sky-900">Bem-Estar e Saúde</h3>
            <p className="text-sky-700 text-sm">Yoga, meditação, funcional e treinos personalizados com a brisa do mar.</p>
          </div>

          {/* Card de Atividade 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-sky-100">
            <Image 
              src="/images/icon-aquaticos.svg" 
              alt="Ícone de Esportes Aquáticos" 
              width={50} 
              height={50} 
              className="mb-4" 
              style={{ height: 'auto' }}
            />
            <h3 className="text-xl font-semibold mb-2 text-sky-900">Esportes Aquáticos</h3>
            <p className="text-sky-700 text-sm">Surf, Stand Up Paddle, Canoa Havaiana. Explore o mar de novas maneiras.</p>
          </div>

          {/* Card de Atividade 4 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-sky-100">
            <Image 
              src="/images/icon-eventos.svg" 
              alt="Ícone de Eventos e Torneios" 
              width={50} 
              height={50} 
              className="mb-4" 
              style={{ height: 'auto' }}
            />
            <h3 className="text-xl font-semibold mb-2 text-sky-900">Eventos e Torneios</h3>
            <p className="text-sky-700 text-sm">Participe de competições, aulões especiais e festivais na praia.</p>
          </div>
        </div>

        {/* Reduzindo margem superior do botão mt-12 para mt-10 */}
        <div className="text-center mt-10">
          <Link 
            href="/atividades" 
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm"
          >
            Ver Todas as Atividades
          </Link>
        </div>
      </div>

      {/* Divisor de Ondas na Base */}
      <WaveDivider 
        position="bottom" 
        primaryColor="#f0f9ff"
        secondaryColor="#e0f2fe"
        tertiaryColor="#bae6fd"
        animate={isVisible}
      />
    </section>
  );
} 