'use client';

import { RefObject } from 'react';
import WaveDivider from '@/components/WaveDivider';
import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface PorQueEscolherSectionProps {
  sectionRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function PorQueEscolherSection({ sectionRef, isVisible }: PorQueEscolherSectionProps) {
  const features = [
    { title: 'Variedade Incomparável', description: 'Centenas de opções de aulas, treinos e eventos esportivos.', icon: CheckCircleIcon },
    { title: 'Conexão Direta', description: 'Encontre instrutores e organizadores perto de você.', icon: CheckCircleIcon },
    { title: 'Facilidade Total', description: 'Busque, agende e pague suas atividades em um só lugar.', icon: CheckCircleIcon },
    { title: 'Comunidade Ativa', description: 'Conecte-se com outros praticantes e compartilhe experiências.', icon: CheckCircleIcon },
    { title: 'Qualidade Garantida', description: 'Profissionais verificados e avaliações reais.', icon: CheckCircleIcon },
    { title: 'Inspiração Constante', description: 'Descubra novas modalidades e desafie seus limites.', icon: CheckCircleIcon },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-b from-sky-50 to-cyan-100 relative wave-container">
      <WaveDivider 
        position="top" 
        primaryColor="#e0f2fe" 
        secondaryColor="#cffafe" 
        tertiaryColor="#a5f3fc"
        animate={isVisible}
      />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square max-w-md mx-auto lg:max-w-none lg:aspect-[4/3]">
            <Image 
              src="/images/atividade_mar.jpg" 
              alt="Pessoas se exercitando e socializando na praia"
              fill
              className="object-cover rounded-2xl shadow-xl"
              sizes="(max-width: 1023px) 90vw, 50vw"
              loading="lazy"
            />
          </div>

          <div>
            <div className="inline-flex items-center px-4 py-1 rounded-lg bg-white/50 backdrop-blur-sm text-cyan-800 mb-4 text-sm font-medium">
              <span>Nossos Diferenciais</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-900">
              Por que escolher a PRAIATIVA?
            </h2>
            <p className="text-lg text-cyan-800 mb-6">
              Simplificamos a forma como você encontra e participa de atividades na praia, oferecendo uma experiência completa e motivadora.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="h-6 w-6 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-cyan-900">{feature.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WaveDivider 
        position="bottom" 
        primaryColor="#e0f2fe" 
        secondaryColor="#cffafe" 
        tertiaryColor="#a5f3fc"
        animate={isVisible}
      />
    </section>
  );
} 