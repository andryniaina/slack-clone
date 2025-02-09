import { User } from '../data/dtos/user';

/**
 * Trie la liste des utilisateurs avec l'utilisateur connecté en dernier
 * @param users Liste des utilisateurs à trier
 * @param currentUserId ID de l'utilisateur connecté
 * @returns Liste triée des utilisateurs
 */
export const sortUsersWithCurrentUserLast = (users: User[] | undefined, currentUserId?: string): User[] => {
  if (!users || !currentUserId) return users || [];

  return [...users].sort((a, b) => {
    // Si a est l'utilisateur courant, il doit être après b
    if (a._id === currentUserId) return 1;
    // Si b est l'utilisateur courant, il doit être après a
    if (b._id === currentUserId) return -1;

    // Trier par statut en ligne
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;

    // Enfin par nom d'utilisateur
    return (a.username || a.email).localeCompare(b.username || b.email);
  });
}; 