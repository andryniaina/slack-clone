import { User } from '../../../data/dtos/user';
import { Message } from '../../../data/dtos/message';
import { DirectMessageItem } from '../DirectMessageItem';
import { Plus, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { sortUsersWithCurrentUserLast } from '../../../utils/user';
import clsx from 'clsx';

interface DirectMessagesListProps {
  users: User[];
  selectedUser?: User | null;
  onUserSelect: (user: User) => void;
  isLoading?: boolean;
  lastMessages?: Record<string, Message>;
  onAddColleaguesClick?: () => void;
}

export function DirectMessagesList({
  users,
  selectedUser,
  onUserSelect,
  isLoading,
  lastMessages,
  onAddColleaguesClick
}: DirectMessagesListProps) {
  const { user: currentUser } = useAuth();
  
  // Trier les utilisateurs avec l'utilisateur courant en dernier
  const sortedUsers = sortUsersWithCurrentUserLast(users, currentUser?._id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 text-white/70">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <span className="text-sm">Chargement...</span>
      </div>
    );
  }

  if (!sortedUsers?.length) {
    return (
      <div className="px-2 py-4 text-white/70 text-sm text-center">
        Aucun utilisateur disponible
      </div>
    );
  }

  return (
    <div>
      {/* Empty State Section */}
      <div className="px-4 py-3 bg-[#512654] mb-4">
        <div className="flex items-start">
          <div className="text-xl mr-2">👋</div>
          <div>
            <p className="text-white text-sm font-medium mb-1">
              Personne ne manque à l'appel ? Ajoutez votre équipe et lancez la conversation.
            </p>
            <button
              onClick={onAddColleaguesClick}
              className="bg-white text-[#431343] text-sm font-medium px-4 py-1.5 rounded hover:bg-white/90"
            >
              Ajouter des collègues
            </button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="mt-1 space-y-0.5">
        {sortedUsers.map((user) => (
          <DirectMessageItem
            key={user._id}
            user={user}
            lastMessage={lastMessages?.[user._id]}
            isSelected={selectedUser?._id === user._id}
            onClick={() => onUserSelect(user)}
          />
        ))}
      </div>
    </div>
  );
} 