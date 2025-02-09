import { useState } from 'react';
import { ChatContainer } from '../../../components/Chat/ChatContainer';
import { SidebarChannelItem } from '../../../components/views/Dashboard/SidebarChannelItem';
import { SidebarUserItem } from '../../../components/views/Dashboard/SidebarUserItem';
import { CreateChannelModal } from '../../../components/views/CreateChannelModal';
import { useChat, useChannelSelection, useDirectMessages } from '../../../hooks/chat';
import { X, MoreVertical, Plus } from 'lucide-react';
import { SidebarSection } from '../../../components/views/Dashboard/SidebarSection';
import { useCollapsibleState } from '../../../hooks/ui/useCollapsibleState';
import { User } from '../../../data/dtos/user';
import { Channel } from '../../../data/dtos/channel';

export default function Dashboard() {
  // État modal
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // État des sections réductibles
  const [collapsibleState, toggleSection] = useCollapsibleState('dashboard_sections', {
    channels: false, // false = expanded by default
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

  const {
    messages,
    isLoadingMessages,
    handleSendMessage
  } = useChat(selectedDirectChannel || selectedChannel);

  // Contenu du header pour le chat
  const headerRightContent = (
    <div className="flex items-center gap-3">
      <button className="text-gray-600 hover:text-gray-800">
        <MoreVertical className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          handleChannelSelect(null);
          setSelectedUser(null);
          setSelectedDirectChannel(null);
        }}
        className="text-gray-600 hover:text-gray-800"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const handleUserClick = async (user: User) => {
    handleChannelSelect(null);
    await handleUserSelect(user);
  };

  const handleChannelClick = (channel: Channel) => {
    setSelectedUser(null);
    setSelectedDirectChannel(null);
    handleChannelSelect(channel);
  };

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