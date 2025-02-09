import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { MessageService } from '../../services/message';
import { Message } from '../../data/dtos/message';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useEffect } from 'react';

const MESSAGE_QUERY_KEY = 'messages';

// Clé de query pour les messages
export const MESSAGES_QUERY_KEY = ['messages'] as const;

// Clé de query pour les utilisateurs en train de taper
export const TYPING_USERS_QUERY_KEY = ['typingUsers'] as const;

export function useChannelMessages(channelId: string | undefined) {
  const queryClient = useQueryClient();
  const { socket } = useWebSocket();

  // Requête initiale pour charger les messages
  const query = useQuery<Message[], Error>({
    queryKey: [MESSAGE_QUERY_KEY, channelId],
    queryFn: () => {
      if (!channelId) {
        return Promise.resolve([]);
      }
      return MessageService.getChannelMessages(channelId);
    },
    staleTime: Infinity, // Les messages ne deviennent jamais périmés automatiquement
    enabled: !!channelId // N'exécute la requête que si channelId existe
  });

  // Écouter les nouveaux messages via WebSocket
  useEffect(() => {
    if (!socket || !channelId) return;

    const handleNewMessage = (message: Message) => {
      console.log('message', message);
      if (message.channel === channelId) {
        // Invalider la requête pour déclencher un nouveau fetch
        queryClient.invalidateQueries({
          queryKey: [MESSAGE_QUERY_KEY, channelId],
        });
      }
    };

    // S'abonner aux événements de messages
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, channelId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ channelId, content, parentMessageId }: {
      channelId: string;
      content: string;
      parentMessageId?: string;
    }) => {
      return MessageService.sendMessage(channelId, content, parentMessageId);
    },
    onSuccess: (_, variables) => {
      // Invalider la requête après l'envoi d'un message
      queryClient.invalidateQueries({
        queryKey: [MESSAGE_QUERY_KEY, variables.channelId],
      });
    },
  });

  return mutation;
}

export function useTypingStatus(channelId: string | undefined) {
  const { socket } = useWebSocket();
  const queryClient = useQueryClient();

  const setTyping = (isTyping: boolean) => {
    if (!socket || !channelId) return;
    socket.emit('typing', { channelId, isTyping });
  };

  useEffect(() => {
    if (!socket || !channelId) return;

    const handleUserTyping = ({ userId, channelId: typingChannelId, isTyping }: any) => {
      if (typingChannelId === channelId) {
        queryClient.setQueryData(['typingUsers', channelId], (oldTypingUsers: string[] = []) => {
          if (isTyping && !oldTypingUsers.includes(userId)) {
            return [...oldTypingUsers, userId];
          } else if (!isTyping) {
            return oldTypingUsers.filter(id => id !== userId);
          }
          return oldTypingUsers;
        });
      }
    };

    socket.on('userTyping', handleUserTyping);

    return () => {
      socket.off('userTyping', handleUserTyping);
    };
  }, [socket, channelId, queryClient]);

  const typingUsers = useQuery<string[]>({
    queryKey: ['typingUsers', channelId],
    queryFn: () => [],
    initialData: [],
    enabled: !!channelId,
  });

  return { setTyping, typingUsers: typingUsers.data };
} 