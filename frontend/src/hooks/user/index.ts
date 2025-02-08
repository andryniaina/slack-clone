import { useQuery } from '@tanstack/react-query';
import { UserService } from '../../services/user';
import { User } from '../../data/dtos/user';

// Clé de query pour la liste des utilisateurs
export const USERS_QUERY_KEY = ['users'] as const;

/**
 * Hook personnalisé pour récupérer la liste des utilisateurs
 * @returns Query object contenant les données des utilisateurs et l'état de la requête
 */
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => UserService.getAllUsers(),
    staleTime: 1000 * 60 * 5, // Considérer les données comme fraîches pendant 5 minutes
    refetchOnWindowFocus: true, // Actualiser les données quand la fenêtre reprend le focus
  });
};
