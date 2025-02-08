import { 
    ChevronDown, 
    Plus, 
    Send,
    AtSign,
    Smile,
    MoreVertical,
    X,
    Loader2,
    Hash,
  } from 'lucide-react';
  import { useState, useRef, KeyboardEvent, useEffect } from 'react';
  import avatar from '../../../assets/images/avatar.png';
  import { useUsers } from '../../../hooks/user';
  import { useAuth } from '../../../contexts/AuthContext';
  import { User } from '../../../data/dtos/user';
  import clsx from 'clsx';
  import { ChannelService } from '../../../services/channel';
  import { Channel } from '../../../data/dtos/channel';
  import { ChannelType } from '../../../data/dtos/channel';
  import { Message } from '../../../components/Message';
  import { useChannelMessages, useSendMessage, useTypingStatus } from '../../../hooks/message';
  import { Message as MessageType } from '../../../data/dtos/message';
  import { useAccessibleChannels } from '../../../hooks/channel';
  import { useQueryClient } from '@tanstack/react-query';
  import { CreateChannelModal } from '../../../components/views/CreateChannelModal';
  
  export default function Directs() {
    const { user: currentUser } = useAuth();
    const { data: users, isLoading: usersLoading } = useUsers();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const { data: channels = [], isLoading: isChannelsLoading } = useAccessibleChannels();
    const [message, setMessage] = useState('');
    const sendMessageMutation = useSendMessage();
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const { setTyping } = useTypingStatus(selectedChannel?._id || '');
    const queryClient = useQueryClient();
    const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  
    // Handle typing status
    useEffect(() => {
      if (isTyping) {
        setTyping(true);
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
          setIsTyping(false);
        }, 2000);
      }
      
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, [isTyping, setTyping]);
  
    // Trier les utilisateurs
    const sortedUsers = users
      ?.sort((a, b) => {
        // Trier d'abord par statut en ligne
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        // Puis par nom d'utilisateur
        return (a.username || a.email).localeCompare(b.username || b.email);
      }) ?? [];
  
    // Trouver le canal correspondant à l'utilisateur sélectionné
    const findChannelForUser = (user: User) => {
      console.log('=== Début de la recherche de canal ===');
      console.log('Utilisateur sélectionné:', { id: user._id, name: user.username || user.email });
      console.log('Utilisateur courant:', { id: currentUser?._id, name: currentUser?.username || currentUser?.email });
      console.log('Nombre de canaux disponibles:', channels.length);
      
      const foundChannel = channels.find(channel => {
        // Vérifier si c'est un canal direct avec des participants
        if (channel.type !== ChannelType.DIRECT || !channel.participants) {
          return false;
        }
        
        // Pour un self-chat (conversation avec soi-même)
        if (user._id === currentUser?._id) {
          const userIdStr = user._id.toString();
          const isSelfChat = channel.participants.length === 2 && 
                            channel.participants.every(participantId => participantId.toString() === userIdStr);
          
          return isSelfChat;
        }
        
        // Pour une conversation entre deux utilisateurs différents
        const selectedUserIdStr = user._id.toString();
        const currentUserIdStr = currentUser?._id.toString();
        
        const hasSelectedUser = channel.participants.some(participantId => 
          participantId.toString() === selectedUserIdStr
        );
        const hasCurrentUser = currentUserIdStr && channel.participants.some(participantId => 
          participantId.toString() === currentUserIdStr
        );
        const hasTwoParticipants = channel.participants.length === 2;
  
        console.log('Vérifications:', {
          hasSelectedUser,
          hasCurrentUser,
          hasTwoParticipants,
          participants: channel.participants,
          selectedUserIdStr,
          currentUserIdStr
        });
  
        const isValidChannel = hasTwoParticipants && hasSelectedUser && hasCurrentUser;
        
        return isValidChannel;
      });
  
      console.log('\n=== Résultat de la recherche ===');
      console.log('Canal trouvé:', foundChannel ? {
        id: foundChannel._id,
        name: foundChannel.name,
        participants: foundChannel.participants
      } : 'Aucun canal trouvé');
  
      return foundChannel;
    };
  
    // Gérer la sélection d'un utilisateur
    const handleUserClick = async (user: User) => {
      if (user) {
        setSelectedUser(user);
        try {
          // Si le canal n'existe pas encore, le créer
          const newChannel = await ChannelService.getOrCreateDirectChannel(user._id);
          console.log('newChannel', newChannel);
          // Invalider la requête des canaux accessibles pour forcer un rechargement
          queryClient.invalidateQueries({ 
            queryKey: ['channels', 'accessible'] 
          });
          setSelectedChannel(newChannel);
        } catch (error) {
          console.error('Erreur lors de la création du canal:', error);
        }
      }
    };
  
    // Rendu d'un utilisateur dans la liste
    const renderUserItem = (user: User) => {
      const isLoading = usersLoading || isChannelsLoading;
  
      return (
        <button 
          key={user._id}
          onClick={() => handleUserClick(user)}
          disabled={isLoading}
          className={clsx(
            "w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded group",
            selectedUser?._id === user._id && "bg-[#1164A3] text-white hover:bg-[#1164A3]",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className={clsx(
            "w-4 h-4 rounded-full mr-2",
            user.isOnline ? "bg-green-500" : "bg-gray-500"
          )} />
          <span className={clsx(
            "group-hover:text-white",
            selectedUser?._id === user._id && "text-white"
          )}>
            {user.username || user.email}
            {user._id === currentUser?._id && (
              <span className="ml-1 text-xs text-white/50">vous</span>
            )}
          </span>
        </button>
      );
    };
  
    const handleSendMessage = async () => {
      if (!message.trim() || !selectedChannel) return;
      
      try {
        await sendMessageMutation.mutateAsync({
          channelId: selectedChannel._id,
          content: message.trim(),
        });
        
        setMessage('');
        
        // Réinitialiser l'indicateur de frappe
        if (isTyping) {
          setIsTyping(false);
          setTyping(false);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    };
  
    const handleCreateChannel = async (newChannel: Channel) => {
      // Invalider la requête des canaux accessibles pour forcer un rechargement
      queryClient.invalidateQueries({ 
        queryKey: ['channels', 'accessible'] 
      });
    };
  
    const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };
  
    return (
      <div className="flex h-full bg-[#3E0F3F]">
        {/* Left Sidebar */}
        <div className="w-[260px] bg-[#512654] flex flex-col flex-shrink-0 rounded-lg">
          {/* Sections */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Channels Section */}
            <div>
              <div className="flex items-center justify-between px-2 py-1 text-white/70 hover:text-white cursor-pointer">
                <div className="flex items-center">
                  <ChevronDown size={16} className="mr-1" />
                  <span className="text-sm font-medium">Canaux</span>
                </div>
              </div>
              <div className="mt-1 space-y-0.5">
                {isChannelsLoading ? (
                  <div className="flex items-center justify-center py-4 text-white/70">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Chargement...</span>
                  </div>
                ) : channels.length === 0 ? (
                  <div className="px-2 py-4 text-white/70 text-sm text-center">
                    Aucun canal disponible
                  </div>
                ) : (
                  channels.map((channel) => (
                    <button
                      key={channel._id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full ${
                        selectedChannel?._id === channel._id ? 'bg-[#1164A3] text-white' : 'text-white/70 hover:bg-[#350D36]'
                      } px-2 py-1 text-sm flex items-center rounded`}
                    >
                      <Hash size={16} className="mr-2" />
                      {channel.name}
                    </button>
                  ))
                )}
                <button 
                  onClick={() => setIsCreateChannelModalOpen(true)}
                  className="w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded"
                >
                  <Plus size={16} className="mr-2" />
                  Créer un canal
                </button>
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-2 py-1 text-white/70 hover:text-white cursor-pointer">
                <div className="flex items-center">
                  <ChevronDown size={16} className="mr-1" />
                  <span className="text-sm font-medium">Messages directs</span>
                </div>
              </div>
              <div className="mt-1 space-y-0.5">
                {usersLoading || isChannelsLoading ? (
                  <div className="flex items-center justify-center py-4 text-white/70">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Chargement...</span>
                  </div>
                ) : users?.length === 0 ? (
                  <div className="px-2 py-4 text-white/70 text-sm text-center">
                    Aucun utilisateur disponible
                  </div>
                ) : (
                  sortedUsers.map(renderUserItem)
                )}
                <button className="w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded">
                  <Plus size={16} className="mr-2" />
                  Ajouter des collègues
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Chat Header */}
              <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-white">
                <div className="flex items-center">
                  {selectedChannel.type === ChannelType.DIRECT ? (
                    // Header pour les messages directs
                    <>
                      <div className="relative">
                        <img 
                          src={selectedUser?.avatar || avatar} 
                          alt={selectedUser?.username || selectedUser?.email} 
                          className="w-6 h-6 rounded-full" 
                        />
                        <div className={clsx(
                          "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white",
                          selectedUser?.isOnline ? "bg-green-500" : "bg-gray-500"
                        )}></div>
                      </div>
                      <span className="ml-2 font-medium">
                        {selectedUser?.username || selectedUser?.email}
                      </span>
                    </>
                  ) : (
                    // Header pour les canaux publics/privés
                    <>
                      <Hash className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium">
                        {selectedChannel.name}
                      </span>
                      {selectedChannel.type === ChannelType.PRIVATE && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Canal privé)
                        </span>
                      )}
                    </>
                  )}
                </div>
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
              </div>
  
              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto bg-white">
                <MessageList channelId={selectedChannel._id} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="border border-gray-300 rounded-lg">
                  {/* Message Input Area */}
                  <textarea 
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      // Gérer l'indicateur de frappe
                      if (!isTyping && selectedChannel) {
                        setIsTyping(true);
                        setTyping(true);
                        
                        // Réinitialiser après 3 secondes d'inactivité
                        if (typingTimeoutRef.current) {
                          clearTimeout(typingTimeoutRef.current);
                        }
                        
                        typingTimeoutRef.current = setTimeout(() => {
                          setIsTyping(false);
                          setTyping(false);
                        }, 3000);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedChannel?.type === ChannelType.DIRECT
                        ? selectedUser?._id === currentUser?._id 
                          ? "Notez quelque chose"
                          : `Envoyer un message à ${selectedUser?.username || selectedUser?.email}`
                        : `Envoyer un message dans #${selectedChannel?.name}`
                    }
                    className="w-full px-3 py-2 min-h-[80px] resize-none focus:outline-none text-gray-900 text-sm placeholder:text-gray-400"
                  />

                  {/* Bottom Toolbar */}
                  <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                        <AtSign className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                        <Smile className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <button 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={clsx(
                        "w-8 h-8 flex items-center justify-center rounded",
                        message.trim() ? "text-[#007a5a] hover:bg-[#007a5a]/10" : "text-gray-400"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h2>
                <p className="text-sm text-gray-500">
                  Choisissez un canal ou un utilisateur dans la liste pour démarrer une conversation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Create Channel Modal */}
        <CreateChannelModal
          isOpen={isCreateChannelModalOpen}
          onClose={() => setIsCreateChannelModalOpen(false)}
        />
      </div>
    );
  }
  
  function MessageList({ channelId }: { channelId: string }) {
    const { 
      data: messages,
      isLoading,
      error
    } = useChannelMessages(channelId);
    const { typingUsers } = useTypingStatus(channelId);
    const { user: currentUser } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    // Faire défiler vers le bas lors de nouveaux messages
    useEffect(() => {
      console.log('messages', messages);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          Une erreur est survenue lors du chargement des messages
        </div>
      );
    }
  
    if (!messages?.length) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Aucun message dans cette conversation
        </div>
      );
    }
  
    return (
      <div className="py-4">
        {messages.map((message: MessageType, index: number) => {
          const prevMessage = messages[index - 1];
          const isFirstInGroup = !prevMessage || 
            prevMessage.sender._id !== message.sender._id ||
            new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000;
  
          return (
            <Message
              key={message._id}
              message={message}
              isFirstInGroup={isFirstInGroup}
            />
          );
        })}
        <div ref={messagesEndRef} />
        
        {/* Indicateur de frappe */}
        {typingUsers && typingUsers.length > 0 && (
          <div className="px-6 py-2 text-sm text-gray-500">
            {typingUsers
              .filter(userId => userId !== currentUser?._id)
              .length === 1
              ? "Un utilisateur est en train d'écrire..."
              : "Plusieurs utilisateurs sont en train d'écrire..."}
          </div>
        )}
      </div>
    );
  } 