import { ChatContainer } from '../../components/Chat/ChatContainer';
import { SidebarUserItem } from '../../components/Dashboard/SidebarUserItem';
import { useChat, useDirectMessages } from '../../../hooks/chat';
import { X, MoreVertical } from 'lucide-react';
import { SidebarSection } from '../../components/Dashboard/SidebarSection';
import { useCollapsibleState } from '../../../hooks/ui/useCollapsibleState';
import { User } from '../../../data/dtos/user';

export default function Directs() {
  // État des sections réductibles
  const [collapsibleState, toggleSection] = useCollapsibleState('directs_sections', {
    directMessages: false // false = expanded by default
  });

  // Hooks personnalisés pour la gestion des messages directs
  const {
    users,
    selectedUser,
    selectedChannel,
    isLoadingUsers,
    handleUserSelect,
    setSelectedUser,
    setSelectedChannel
  } = useDirectMessages();

  const {
    messages,
    isLoadingMessages,
    handleSendMessage
  } = useChat(selectedChannel);

  // Contenu du header pour le chat
  const headerRightContent = (
    <div className="flex items-center gap-3">
      <button className="text-gray-600 hover:text-gray-800">
        <MoreVertical className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          setSelectedChannel(null);
          setSelectedUser(null);
        }}
        className="text-gray-600 hover:text-gray-800"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const handleUserClick = async (user: User) => {
    await handleUserSelect(user);
  };

  return (
    <div className="flex h-full bg-[#3E0F3F]">
      {/* Left Sidebar */}
      <div className="w-[260px] bg-[#512654] flex flex-col flex-shrink-0 rounded-lg">
        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
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
        channel={selectedChannel}
        messages={messages}
        isLoadingMessages={isLoadingMessages}
        onSendMessage={handleSendMessage}
        headerRightContent={headerRightContent}
        selectedUser={selectedUser}
      />
    </div>
  );
} 