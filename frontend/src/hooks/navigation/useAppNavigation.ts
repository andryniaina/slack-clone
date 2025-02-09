import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Routes qui ne doivent pas être incluses dans l'historique de navigation
const EXCLUDED_ROUTES = ['/login', '/register', '/forgot-password'];

// Routes autorisées dans la navigation de l'application
const ALLOWED_ROUTES = [
  '/app/dashboard',
  '/app/directs',
  '/app/activity'
];

interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  currentIndex: number;
}

export function useAppNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    history: [],
    currentIndex: -1,
  });

  // Utiliser une ref pour suivre si la navigation a été déclenchée par nos boutons
  const isInternalNavigation = useRef(false);

  // Initialiser ou mettre à jour l'historique lorsque l'emplacement change
  useEffect(() => {
    const path = location.pathname;

    // Ignorer si la route ne doit pas être suivie
    if (EXCLUDED_ROUTES.includes(path)) {
      return;
    }

    // Suivre uniquement les routes autorisées
    if (!ALLOWED_ROUTES.includes(path)) {
      return;
    }

    // Si c'est une navigation déclenchée par nos boutons retour/suivant,
    // ne pas modifier l'historique
    if (isInternalNavigation.current) {
      isInternalNavigation.current = false;
      return;
    }

    setState(prevState => {
      // Si nous ne sommes pas à la fin de l'historique, nous devons tronquer
      // l'historique vers l'avant lors de l'ajout d'une nouvelle route
      const newHistory = prevState.currentIndex < prevState.history.length - 1
        ? [...prevState.history.slice(0, prevState.currentIndex + 1)]
        : prevState.history;

      // Ajouter la nouvelle route
      const updatedHistory = [...newHistory, path];
      const newIndex = updatedHistory.length - 1;

      return {
        history: updatedHistory,
        currentIndex: newIndex,
        canGoBack: newIndex > 0,
        canGoForward: false,
      };
    });
  }, [location.pathname]);

  const goBack = useCallback(() => {
    setState(prevState => {
      if (!prevState.canGoBack) return prevState;

      const newIndex = prevState.currentIndex - 1;
      const targetPath = prevState.history[newIndex];

      isInternalNavigation.current = true;
      navigate(targetPath);

      return {
        ...prevState,
        currentIndex: newIndex,
        canGoBack: newIndex > 0,
        canGoForward: true,
      };
    });
  }, [navigate]);

  const goForward = useCallback(() => {
    setState(prevState => {
      if (!prevState.canGoForward) return prevState;

      const newIndex = prevState.currentIndex + 1;
      const targetPath = prevState.history[newIndex];

      isInternalNavigation.current = true;
      navigate(targetPath);

      return {
        ...prevState,
        currentIndex: newIndex,
        canGoBack: true,
        canGoForward: newIndex < prevState.history.length - 1,
      };
    });
  }, [navigate]);

  return {
    canGoBack: state.canGoBack,
    canGoForward: state.canGoForward,
    goBack,
    goForward,
  };
} 