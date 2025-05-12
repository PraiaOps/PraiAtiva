'use client';

import { RefObject } from 'react';
import WaveDivider from '@/components/WaveDivider';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface HistoriaSectionProps {
  sectionRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function HistoriaSection({ sectionRef, isVisible }: HistoriaSectionProps) {
  return (
    <section ref={sectionRef} className="relative py-16 md:py-20 bg-amber-100 wave-container overflow-hidden">
      <WaveDivider 
        position="top" 
        primaryColor="#fcd34d"
        secondaryColor="#fef3c7"
        tertiaryColor="#f59e0b"
        animate={isVisible}
      />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="lg:col-span-5 lg:order-2">
            <div className="relative aspect-square rounded-full overflow-hidden shadow-xl mx-auto max-w-sm lg:max-w-none border-4 border-white">
              <Image 
                src="/images/beach-hero-sunset.jpg" 
                alt="Fundadores da PraiAtiva sorrindo na praia"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, (max-width: 1023px) 50vw, 40vw"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:order-1">
            <div className="inline-flex items-center px-4 py-1 rounded-lg bg-white/60 backdrop-blur-sm text-amber-800 mb-4 text-sm font-medium">
              <span>Nossa missão</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-900">
              Competindo e se inspirando por uma vida melhor!
            </h2>
            <div className="space-y-4 text-amber-800">
              <p>
                Você alguma vez já tentou achar na internet TODAS as opções de esportes para fazer na praia? É quase certo que acabou tendo que ir no local só para "caçar" informações nos banners... Ou ficou buscando indicações de alguém...
              </p>
              <p className="font-medium text-amber-700">
                Sabia que apenas em 1 km da Praia de Icaraí (Niterói/RJ), existem mais de 500 opções de atividades físicas e esportivas?
              </p>
              <p>
                PRAIATIVA é a primeira plataforma que vai conectar quem busca a quem oferece atividades de esporte, lazer e turismo exclusivamente nas praias. Para você praticar sua saúde do jeito que sempre sonhou: escolhendo suas aulas e torneios aonde, por quanto, com quem, dia, horário, além de orientações e muito mais!
              </p>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/cadastro" 
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 group"
              >
                <span>PRAIATIVE-SE!</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <WaveDivider 
        position="bottom" 
        primaryColor="#fcd34d"
        secondaryColor="#fef3c7"
        tertiaryColor="#f59e0b"
        animate={isVisible}
      />
    </section>
  );
} 