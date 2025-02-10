import { ReactNode } from 'react';
import { Channel, ChannelType } from '../../../data/dtos/channel';
import { Hash, Users } from 'lucide-react';
import { User } from '../../../data/dtos/user';
import avatar from '../../../assets/images/avatar.png';
import clsx from 'clsx';
import { useUsers } from '../../../hooks/user';

interface ChatHeaderProps {
  channel: Channel;
  rightContent?: ReactNode;
  selectedUser?: User | null;
}

export function ChatHeader({ channel, rightContent, selectedUser }: ChatHeaderProps) {
  const isDirectChannel = channel.type === 'direct';
  const { data: users = [] } = useUsers();

  // Récupérer les données de l'utilisateur actuel
  const currentUser = selectedUser ? users.find(u => u._id === selectedUser._id) : null;
  const userToDisplay = currentUser || selectedUser;

  // Calculer le nombre de membres (déduire l'utilisateur système pour les canaux publics)
  const memberCount = channel.type === ChannelType.PUBLIC 
    ? channel.members.length - 1 // Déduire l'utilisateur système
    : channel.members.length;

  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center">
        {isDirectChannel && userToDisplay ? (
          <>
            {/* Avatar avec indicateur de statut */}
            <div className="relative mr-3">
              <img
                src={userToDisplay.avatar || avatar}
                alt={userToDisplay.username || userToDisplay.email}
                className="w-8 h-8 rounded object-cover"
              />
              <div className={clsx(
                "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                userToDisplay.isOnline ? "bg-green-500" : "bg-gray-500"
              )} />
            </div>
            {/* Nom et statut */}
            <div>
              <h2 className="font-medium text-gray-900">
                {userToDisplay.username || userToDisplay.email}
              </h2>
              <p className="text-sm text-gray-500">
                {userToDisplay.isOnline ? "En ligne" : "Hors ligne"}
              </p>
            </div>
          </>
        ) : (
          <>
            <Hash className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <h2 className="font-medium text-gray-900">{channel.name}</h2>
              {channel.description && (
                <p className="text-sm text-gray-500">{channel.description}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isDirectChannel && (
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{memberCount}</span>
          </div>
        )}
        {rightContent}
      </div>
    </div>
  );
} 