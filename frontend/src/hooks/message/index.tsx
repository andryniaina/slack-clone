import { useQuery } from '@tanstack/react-query';
import { MessageService } from '../../services/message';
import { Message } from '../../data/dtos/message';

// Clé de query pour les messages d'un canal
export const CHANNEL_MESSAGES_QUERY_KEY = 'channelMessages';

interface UseChannelMessagesOptions {
  limit?: number;
  before?: string;
  enabled?: boolean;
}

/**
 * Hook personnalisé pour récupérer les messages d'un canal
 * @param channelId ID du canal
 * @param options Options de pagination et de configuration
 */
export const useChannelMessages = (
  channelId: string | undefined,
  options: UseChannelMessagesOptions = {}
) => {
  const { limit, before, enabled = true } = options;

  return useQuery<Message[], Error>({
    queryKey: [CHANNEL_MESSAGES_QUERY_KEY, channelId, { limit, before }],
    queryFn: () => {
      if (!channelId) throw new Error('Channel ID is required');
      return MessageService.getChannelMessages(channelId, { limit, before });
    },
    enabled: enabled && !!channelId,
    staleTime: 1000 * 60, // Considérer les données comme fraîches pendant 1 minute
    refetchOnWindowFocus: true,
  });
};
