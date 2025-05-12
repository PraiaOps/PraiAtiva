'use client';

import { RefObject } from 'react';
import WaveDivider from '@/components/WaveDivider';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'; 
import { useSubscriptionForm } from '@/hooks/useSubscriptionForm';
import clsx from 'clsx';

interface CtaFormSectionProps {
  sectionRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function CtaFormSection({ sectionRef, isVisible }: CtaFormSectionProps) {
  const {
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    email,
    setEmail,
    interesse,
    setInteresse,
    enviado,
    enviando,
    handleSubmit,
  } = useSubscriptionForm();

  return (
    <section ref={sectionRef} className="relative py-16 md:py-20 sand-section text-slate-800 overflow-hidden wave-container">
      <div className="absolute top-0 left-0 right-0 h-12 md:h-20 overflow-hidden z-0">
        <svg 
          className="w-full h-full"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          aria-hidden="true"
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
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
                <CheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-amber-800">Formulário enviado!</h3>
              <p className="text-amber-900">PRAIATIVA agradece o seu apoio! Em breve você receberá nossas novidades.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-amber-800/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-amber-800/20 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                    className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Seu nome"
                    disabled={enviando}
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
                    className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Seu sobrenome"
                    disabled={enviando}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email-cta" className="block text-sm font-medium text-amber-900 mb-1">
                  Email
                </label>
                <input
                  id="email-cta"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="seu@email.com"
                  disabled={enviando}
                  autoComplete="email"
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
                  className="w-full px-4 py-3 bg-white/80 border-0 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                  disabled={enviando}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="praticar">Praticar atividades</option>
                  <option value="oferecer">Oferecer atividades</option>
                  <option value="conhecer">Apenas conhecer o projeto</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={enviando}
                className={clsx(
                  "w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-300 flex items-center justify-center",
                  { "opacity-50 cursor-not-allowed": enviando }
                )}
              >
                {enviando ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Inscreva-se Agora</span>
                )}
                {!enviando && <ArrowRightIcon className="h-4 w-4 ml-2" />}
              </button>
              
              <p className="text-xs text-center mt-4 text-amber-900">
                Ao se inscrever, você concorda com nossa <a href="/politica-privacidade" className="underline hover:text-amber-700">política de privacidade</a>.
              </p>
            </form>
          )}
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