import { User } from '../../../data/dtos/user';
import { Message } from '../../../data/dtos/message';
import { format } from 'date-fns';
import clsx from 'clsx';
import avatar from '../../../assets/images/avatar.png';
import { useAuth } from '../../../contexts/AuthContext';

interface DirectMessageItemProps {
  user: User;
  lastMessage?: Message;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DirectMessageItem({ user, lastMessage, isSelected, onClick }: DirectMessageItemProps) {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser?._id === user._id;

  // Le statut en ligne est forcé à true pour l'utilisateur connecté
  const isOnline = isCurrentUser ? true : user.isOnline;

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm');
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, 'd MMM');
    } else {
      return format(messageDate, 'dd/MM/yyyy');
    }
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left hover:bg-[#643B66] px-2 py-2 rounded group",
        isSelected ? "bg-[#643B66] hover:bg-[#643B66]" : "text-white/70"
      )}
    >
      <div className="flex items-center">
        {/* Avatar et indicateur en ligne */}
        <div className="relative">
          <img
            src={user.avatar || avatar}
            alt={user.username || user.email}
            className="w-8 h-8 rounded object-cover"
          />
          <div className={clsx(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#512654]",
            isOnline ? "bg-green-500" : "bg-gray-500"
          )} />
        </div>

        {/* Informations de l'utilisateur et dernier message */}
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={clsx(
              "font-medium truncate",
              isSelected ? "text-white" : "text-white/90 group-hover:text-white"
            )}>
              {user.username || user.email}
              {isCurrentUser && <span className="text-white/60 ml-1">(vous)</span>}
            </span>
            {lastMessage && (
              <span className="text-xs text-white/50 ml-2">
                {formatMessageTime(lastMessage.createdAt)}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className={clsx(
              "text-sm truncate",
              isSelected ? "text-white/90" : "text-white/60"
            )}>
              {lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </button>
  );
} 