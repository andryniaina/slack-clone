import { useState } from 'react';
import { User } from '../../data/dtos/user';
import { Channel } from '../../data/dtos/channel';
import { useUsers } from '../user';
import { useDirectChannels } from '../channel';
import { ChannelService } from '../../services/channel';
import { useAuth } from '../../contexts/AuthContext';
import { useLastMessages } from '../message/useLastMessages';

export function useDirectMessages() {
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Récupérer les utilisateurs et les canaux
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: channels = [], isLoading: isLoadingChannels } = useDirectChannels();
  const { data: lastMessages = {}, isLoading: isLoadingLastMessages } = useLastMessages(channels);

  // Trouver le canal existant pour un utilisateur
  const findChannelForUser = (user: User) => {
    return channels.find(channel => 
      channel.participants?.some(participant => participant._id === user._id)
    );
  };

  // Gérer la sélection d'un utilisateur
  const handleUserSelect = async (user: User) => {
    try {
      setSelectedUser(user);
      
      // Chercher un canal existant
      let channel = findChannelForUser(user);
      
      // Créer un nouveau canal si nécessaire
      if (!channel) {
        channel = await ChannelService.getOrCreateDirectChannel(user._id);
      }
      
      setSelectedChannel(channel);
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'utilisateur:', error);
    }
  };

  return {
    users,
    selectedUser,
    selectedChannel,
    isLoadingUsers,
    isLoadingChannels,
    lastMessages,
    isLoadingLastMessages,
    handleUserSelect,
    setSelectedUser,
    setSelectedChannel
  };
} 