import { createContext, useContext, useState, useCallback } from 'react';

const LightboxContext = createContext(null);

export function LightboxProvider({ children }) {
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    src: null,
    title: null,
    subtitle: null,
  });

  const openLightbox = useCallback(({ src, title, subtitle }) => {
    setLightbox({ isOpen: true, src, title: title || '', subtitle: subtitle || '' });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <LightboxContext.Provider value={{ lightbox, openLightbox, closeLightbox }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}
