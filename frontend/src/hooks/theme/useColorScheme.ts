import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter le thème du système (clair ou sombre)
 * @returns 'dark' | 'light' - Le thème actuel du système
 */
export function useColorScheme() {
  // Vérifier si le système préfère le thème sombre
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const [colorScheme, setColorScheme] = useState<'dark' | 'light'>(
    prefersDark.matches ? 'dark' : 'light'
  );

  useEffect(() => {
    // Fonction de gestion du changement de thème
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    // Ajouter l'écouteur d'événements
    prefersDark.addEventListener('change', handleChange);

    // Nettoyer l'écouteur d'événements
    return () => {
      prefersDark.removeEventListener('change', handleChange);
    };
  }, []);

  return colorScheme;
} 