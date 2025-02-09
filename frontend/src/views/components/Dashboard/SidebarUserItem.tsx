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
        "w-full text-left px-2 py-1.5 rounded group flex items-center",
        isSelected 
          ? "bg-[#F9EDFF]" 
          : "text-white/70 hover:bg-[#350D36] hover:text-white"
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
        isSelected ? "text-[#69406B]" : "text-white/90"
      )}>
        {user.username || user.email}
        {isCurrentUser && <span className={clsx("ml-1", isSelected ? "text-[#69406B]/60" : "text-white/60")}>(vous)</span>}
      </span>
    </button>
  );
} 