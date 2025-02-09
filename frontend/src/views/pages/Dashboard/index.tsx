import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatContainer } from '../../components/Chat/ChatContainer';
import { SidebarChannelItem } from '../../components/Dashboard/SidebarChannelItem';
import { SidebarUserItem } from '../../components/Dashboard/SidebarUserItem';
import { CreateChannelModal } from '../../components/Dashboard/CreateChannelModal';
import { useChat, useChannelSelection, useDirectMessages } from '../../../hooks/chat';
import { Plus, RefreshCw } from 'lucide-react';
import { SidebarSection } from '../../components/Dashboard/SidebarSection';
import { useCollapsibleState } from '../../../hooks/ui/useCollapsibleState';
import { User } from '../../../data/dtos/user';
import { Channel } from '../../../data/dtos/channel';
import { useQueryClient } from '@tanstack/react-query';
import { CHANNELS_QUERY_KEYS } from '../../../hooks/channel';
import { useWebSocket } from '../../../contexts/WebSocketContext';
import { useAuth } from '../../../contexts/AuthContext';

interface LocationState {
  chatType?: 'channel' | 'user';
  chatData?: Channel | User;
}

export default function Dashboard() {
  const location = useLocation();
  const { socket } = useWebSocket();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasHandledInitialNavigation = useRef(false);

  // État modal
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // État des sections réductibles
  const [collapsibleState, toggleSection] = useCollapsibleState('dashboard_sections', {
    channels: false,
    directMessages: false
  });

  // Hooks personnalisés pour la gestion des canaux et messages
  const {
    selectedChannel,
    channels,
    isLoadingChannels,
    handleChannelSelect
  } = useChannelSelection();

  const {
    users,
    selectedUser,
    selectedChannel: selectedDirectChannel,
    isLoadingUsers,
    handleUserSelect,
    setSelectedUser,
    setSelectedChannel: setSelectedDirectChannel
  } = useDirectMessages();

  // Gestionnaire pour la navigation depuis la recherche
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state?.chatType && state?.chatData) {
      // Réinitialiser la sélection actuelle
      setSelectedUser(null);
      setSelectedDirectChannel(null);
      handleChannelSelect(null);

      // Sélectionner le chat approprié
      if (state.chatType === 'channel') {
        handleChannelClick(state.chatData as Channel);
      } else if (state.chatType === 'user') {
        handleUserClick(state.chatData as User);
      }

      // Marquer que nous avons géré une navigation initiale
      hasHandledInitialNavigation.current = true;

      // Nettoyer l'état de navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleUserClick = async (user: User) => {
    handleChannelSelect(null);
    await handleUserSelect(user);
  };

  const handleChannelClick = (channel: Channel) => {
    setSelectedUser(null);
    setSelectedDirectChannel(null);
    handleChannelSelect(channel);
  };

  const handleRefreshChannels = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEYS.accessible() });
      // Rejoindre les nouveaux canaux via WebSocket
      if (socket && currentUser) {
        socket.emit('join_new_channels', currentUser._id);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sélection par défaut uniquement si aucune navigation n'a été traitée
  useEffect(() => {
    const selectDefault = async () => {
      // Ne rien faire si une navigation a déjà été traitée
      if (hasHandledInitialNavigation.current) {
        return;
      }

      // Ne rien faire si quelque chose est déjà sélectionné
      if (selectedChannel || selectedUser || selectedDirectChannel) {
        return;
      }

      // Attendre que les données soient chargées
      if (isLoadingChannels || isLoadingUsers) {
        return;
      }

      // Priorité 1: Sélectionner le premier canal si disponible
      if (channels.length > 0) {
        handleChannelClick(channels[0]);
        return;
      }

      // Priorité 2: Sélectionner le premier utilisateur si disponible
      if (users?.length > 0) {
        await handleUserClick(users[0]);
      }
    };

    selectDefault();
  }, [
    channels,
    users,
    isLoadingChannels,
    isLoadingUsers,
    selectedChannel,
    selectedUser,
    selectedDirectChannel,
    handleChannelClick,
    handleUserClick
  ]);

  const {
    messages,
    isLoadingMessages,
    handleSendMessage
  } = useChat(selectedDirectChannel || selectedChannel);

  // Contenu du header pour le chat
  const headerRightContent = (
    <div className="flex items-center gap-3">
    </div>
  );

  return (
    <div className="flex h-full bg-[#3E0F3F]">
      {/* Left Sidebar */}
      <div className="w-[260px] bg-[#512654] flex flex-col flex-shrink-0 rounded-lg">
        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Canaux Section */}
          <SidebarSection
            title="Canaux"
            isCollapsible={true}
            isCollapsed={collapsibleState.channels}
            onToggle={() => toggleSection('channels')}
            rightContent={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefreshChannels();
                }}
                disabled={isRefreshing || isLoadingChannels}
                className="p-1 text-white/70 hover:text-white transition-colors disabled:opacity-50"
                title="Rafraîchir la liste des canaux"
              >
                <RefreshCw 
                  size={14} 
                  className={isRefreshing ? "animate-spin" : ""}
                />
              </button>
            }
          >
            {isLoadingChannels ? (
              <div className="px-2 py-4 text-white/70 text-sm text-center">
                Chargement...
              </div>
            ) : !channels.length ? (
              <div className="px-2 py-4 text-white/70 text-sm text-center">
                Aucun canal disponible
              </div>
            ) : (
              channels.map((channel) => (
                <SidebarChannelItem
                  key={channel._id}
                  channel={channel}
                  isSelected={selectedChannel?._id === channel._id}
                  onClick={() => handleChannelClick(channel)}
                />
              ))
            )}
            <button
              onClick={() => setIsCreateChannelModalOpen(true)}
              className="w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded mt-2"
            >
              <Plus size={16} className="mr-2" />
              Créer un canal
            </button>
          </SidebarSection>

          {/* Messages directs Section */}
          <SidebarSection
            title="Messages directs"
            isCollapsible={true}
            isCollapsed={collapsibleState.directMessages}
            onToggle={() => toggleSection('directMessages')}
          >
            {isLoadingUsers ? (
              <div className="px-2 py-4 text-white/70 text-sm text-center">
                Chargement...
              </div>
            ) : !users?.length ? (
              <div className="px-2 py-4 text-white/70 text-sm text-center">
                Aucun utilisateur disponible
              </div>
            ) : (
              users.map((user) => (
                <SidebarUserItem
                  key={user._id}
                  user={user}
                  isSelected={selectedUser?._id === user._id}
                  onClick={() => handleUserClick(user)}
                />
              ))
            )}
          </SidebarSection>
        </div>
      </div>

      {/* Main Chat Container */}
      <ChatContainer
        channel={selectedDirectChannel || selectedChannel}
        messages={messages}
        isLoadingMessages={isLoadingMessages}
        onSendMessage={handleSendMessage}
        headerRightContent={headerRightContent}
        selectedUser={selectedUser}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
      />
    </div>
  );
} 