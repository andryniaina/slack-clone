import { useState } from 'react';
import { Channel } from '../../data/dtos/channel';
import { Message } from '../../data/dtos/message';
import { useChannelMessages, useSendMessage } from '../message';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const MESSAGE_QUERY_KEY = 'messages';

export function useChat(selectedChannel: Channel | null) {
  const [message, setMessage] = useState('');
  const sendMessageMutation = useSendMessage();
  const { socket } = useWebSocket();
  const queryClient = useQueryClient();

  // Récupérer les messages du canal sélectionné
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useChannelMessages(selectedChannel?._id);

  // Écouter les nouveaux messages via WebSocket
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    const handleNewMessage = (message: Message) => {
      console.log('New message in useChat:', message);
      if (message.channel === selectedChannel._id) {
        // Invalider la requête pour déclencher un nouveau fetch
        queryClient.invalidateQueries({
          queryKey: [MESSAGE_QUERY_KEY, selectedChannel._id],
        });
      }
    };

    // S'abonner aux événements de messages
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedChannel, queryClient]);

  // Gérer l'envoi d'un message
  const handleSendMessage = async (content: string) => {
    if (!selectedChannel) return;

    try {
      await sendMessageMutation.mutateAsync({
        channelId: selectedChannel._id,
        content: content.trim(),
      });

      // Actualiser les messages après l'envoi
      refetchMessages();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  return {
    messages,
    isLoadingMessages,
    handleSendMessage,
    message,
    setMessage
  };
} 