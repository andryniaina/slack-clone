import { User } from '../../../data/dtos/user';
import clsx from 'clsx';
import avatar from '../../../assets/images/avatar.png';
import { useAuth } from '../../../contexts/AuthContext';

interface SidebarUserItemProps {
  user: User;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SidebarUserItem({ user, isSelected, onClick }: SidebarUserItemProps) {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser?._id === user._id;

  // Le statut en ligne est forcé à true pour l'utilisateur connecté
  const isOnline = isCurrentUser ? true : user.isOnline;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left hover:bg-[#350D36] px-2 py-1.5 rounded group flex items-center",
        isSelected ? "bg-[#1164A3] hover:bg-[#1164A3]" : "text-white/70"
      )}
    >
      {/* Avatar avec indicateur de statut */}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar || avatar}
          alt={user.username || user.email}
          className="w-5 h-5 rounded"
        />
        <div className={clsx(
          "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#350D36]",
          isOnline ? "bg-green-500" : "bg-gray-500"
        )} />
      </div>

      {/* Nom d'utilisateur */}
      <span className={clsx(
        "ml-2 text-sm truncate",
        isSelected ? "text-white" : "text-white/90 group-hover:text-white"
      )}>
        {user.username || user.email}
        {isCurrentUser && <span className="text-white/60 ml-1">(vous)</span>}
      </span>
    </button>
  );
} 