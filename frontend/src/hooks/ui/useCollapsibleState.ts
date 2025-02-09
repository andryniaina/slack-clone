import { useState, useCallback, useEffect } from 'react';

// Type pour l'état des sections réductibles
type CollapsibleState = Record<string, boolean>;

/**
 * Hook personnalisé pour gérer l'état de réduction des sections
 * avec persistance dans le localStorage
 * @param storageKey - Clé unique pour le localStorage
 * @param initialState - État initial des sections
 * @returns [state, toggleSection] - État actuel et fonction pour basculer une section
 */
export function useCollapsibleState(storageKey: string, initialState: CollapsibleState): [CollapsibleState, (sectionId: string) => void] {
  // Initialiser l'état avec les valeurs du localStorage ou l'état initial
  const [state, setState] = useState<CollapsibleState>(() => {
    const savedState = localStorage.getItem(storageKey);
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Sauvegarder l'état dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  // Fonction pour basculer l'état d'une section
  const toggleSection = useCallback((sectionId: string) => {
    setState(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  }, []);

  return [state, toggleSection];
} 