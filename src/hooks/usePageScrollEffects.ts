'use client';

import { useState, useEffect, RefObject, useRef, useCallback } from 'react';
import { throttle } from 'lodash';

interface ScrollEffectsOptions {
  parallaxRef?: RefObject<HTMLElement>; // Elemento para efeito parallax
  parallaxFactor?: number; // Fator de parallax (padrão 0.5)
  intersectionRefs?: { [key: string]: RefObject<HTMLElement> }; // Refs para observar interseção
  intersectionThreshold?: number; // Threshold para Intersection Observer (padrão 0.1)
  onIntersectionChange?: (visibility: { [key: string]: boolean }) => void; // Callback para mudança de visibilidade
}

export function usePageScrollEffects({
  parallaxRef,
  parallaxFactor = 0.5,
  intersectionRefs = {},
  intersectionThreshold = 0.1,
  onIntersectionChange,
}: ScrollEffectsOptions = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [elementVisibility, setElementVisibility] = useState<{ [key: string]: boolean }>({});

  // Ref para guardar a última versão do callback onIntersectionChange
  const onIntersectionChangeRef = useRef(onIntersectionChange);

  // Atualizar a ref sempre que o callback mudar
  useEffect(() => {
    onIntersectionChangeRef.current = onIntersectionChange;
  }, [onIntersectionChange]);

  // Efeito Parallax (controlado por scroll)
  useEffect(() => {
    if (!parallaxRef?.current) return;

    const element = parallaxRef.current;

    const handleScrollParallax = throttle(() => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Aplicar transform diretamente pode ser mais performático que re-renderizar
      element.style.transform = `translateY(${currentScrollY * parallaxFactor}px)`;
    }, 16); // Throttle mais agressivo para animação suave (aprox 60fps)

    window.addEventListener('scroll', handleScrollParallax, { passive: true });
    handleScrollParallax(); // Aplicar posição inicial

    return () => {
      window.removeEventListener('scroll', handleScrollParallax);
      handleScrollParallax.cancel();
      // Limpar style inline ao desmontar
      if (element) element.style.transform = ''; 
    };
  }, [parallaxRef, parallaxFactor]);

  // Intersection Observer para visibilidade de elementos (lógica corrigida)
  useEffect(() => {
    const refsToObserve = Object.entries(intersectionRefs)
                              .map(([key, ref]) => ({ key, element: ref.current }))
                              .filter(item => item.element);

    if (refsToObserve.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
         // Usar setElementVisibility com callback para garantir acesso ao estado mais recente (prev)
         setElementVisibility(prev => {
            const updatedVisibility: { [key: string]: boolean } = {};
            entries.forEach(entry => {
              const key = refsToObserve.find(item => item.element === entry.target)?.key;
              if (key) {
                // Atualiza apenas as chaves que mudaram nesta leva de entries
                updatedVisibility[key] = entry.isIntersecting;
              }
            });

            // Calcular o *próximo* estado completo mergeando o anterior com as atualizações
            const nextVisibility = { ...prev, ...updatedVisibility };

            // Chamar o callback (se existir) com o estado atualizado, usando a ref
            if (onIntersectionChangeRef.current) {
              onIntersectionChangeRef.current(nextVisibility);
            }
            
            // Retornar o próximo estado para atualizar o state do hook
            return nextVisibility;
         });
      },
      { threshold: intersectionThreshold } 
    );

    refsToObserve.forEach(item => observer.observe(item.element!));

    // Comentando a inicialização síncrona que pode causar problemas
    /*
    const initialVisibility: { [key: string]: boolean } = {};
    refsToObserve.forEach(item => {
       const rect = item.element!.getBoundingClientRect();
       initialVisibility[item.key] = rect.top < window.innerHeight && rect.bottom >= 0;
    });
    setElementVisibility(initialVisibility);
     if (onIntersectionChangeRef.current) {
         onIntersectionChangeRef.current(initialVisibility);
     }
    */

    return () => {
      refsToObserve.forEach(item => {
          if (item.element) {
            observer.unobserve(item.element)
          }
      });
    };
  // Remover onIntersectionChange das dependências, pois usamos a ref
  }, [intersectionRefs, intersectionThreshold]); // Apenas refs e threshold como dependências

  return {
    scrollY,
    elementVisibility,
  };
} 