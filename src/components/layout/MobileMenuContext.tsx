import { createContext } from 'react';

export const MobileMenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: (_: boolean) => {},
});
