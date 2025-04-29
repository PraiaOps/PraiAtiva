import { useState, useEffect, MutableRefObject } from 'react';

type SectionRefs = {
  [key: string]: MutableRefObject<HTMLElement | null>;
};

type WaveVisibility = {
  [key: string]: boolean;
};

/**
 * Hook para gerenciar a visibilidade das animações de ondas 
 * baseadas na posição de scroll
 */
const useWaveAnimation = (sectionRefs: SectionRefs) => {
  const [waveVisibility, setWaveVisibility] = useState<WaveVisibility>(
    Object.keys(sectionRefs).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {})
  );

  const [scrollY, setScrollY] = useState(0);
  const [menuFixed, setMenuFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setMenuFixed(scrollPosition > 100);
      
      // Verificar quais seções estão visíveis para ativar as ondas
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // A onda se torna visível quando a seção entra na área visível
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          setWaveVisibility(prev => {
            if (prev[key] !== isVisible) {
              return {...prev, [key]: isVisible};
            }
            return prev;
          });
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Iniciar com a verificação
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs]);

  return { scrollY, menuFixed, waveVisibility };
};

export default useWaveAnimation; 