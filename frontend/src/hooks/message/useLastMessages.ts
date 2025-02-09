import { useQuery } from '@tanstack/react-query';
import { Message } from '../../data/dtos/message';
import { Channel } from '../../data/dtos/channel';
import { MessageService } from '../../services/message';

export function useLastMessages(channels: Channel[] | undefined) {
  return useQuery<Record<string, Message>>({
    queryKey: ['lastMessages', channels?.map(c => c._id)],
    queryFn: async () => {
      if (!channels?.length) return {};

      const lastMessages: Record<string, Message> = {};

      // Récupérer le dernier message pour chaque canal
      await Promise.all(
        channels.map(async (channel) => {
          try {
            const messages = await MessageService.getChannelMessages(channel._id, { limit: 1 });
            if (messages.length > 0) {
              // Pour les messages directs, on associe le message au participant plutôt qu'au canal
              const otherParticipant = channel.participants?.find(
                p => p._id !== messages[0].sender._id
              );
              if (otherParticipant) {
                lastMessages[otherParticipant._id] = messages[0];
              }
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération des messages pour le canal ${channel._id}:`, error);
          }
        })
      );

      return lastMessages;
    },
    enabled: !!channels?.length,
    staleTime: 1000 * 60, // Considérer les données comme fraîches pendant 1 minute
  });
} 