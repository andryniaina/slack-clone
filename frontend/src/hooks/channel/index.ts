import { useQuery } from '@tanstack/react-query';
import { ChannelService } from '../../services/channel';
import { Channel } from '../../data/dtos/channel';

// Clés de query pour les canaux
export const CHANNELS_QUERY_KEYS = {
  all: ['channels'] as const,
  accessible: () => [...CHANNELS_QUERY_KEYS.all, 'accessible'] as const,
  direct: () => [...CHANNELS_QUERY_KEYS.all, 'direct'] as const,
};

/**
 * Hook personnalisé pour récupérer les canaux accessibles
 * (canaux publics ou canaux privés dont l'utilisateur est membre)
 */
export function useAccessibleChannels() {
  return useQuery<Channel[], Error>({
    queryKey: CHANNELS_QUERY_KEYS.accessible(),
    queryFn: () => ChannelService.getAccessibleChannels(),
    staleTime: 1000 * 60 * 5, // Considérer les données comme fraîches pendant 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook personnalisé pour récupérer les canaux de messages directs
 */
export function useDirectChannels() {
  return useQuery<Channel[], Error>({
    queryKey: CHANNELS_QUERY_KEYS.direct(),
    queryFn: () => ChannelService.getAllDirectChannels(),
    staleTime: 1000 * 60 * 5, // Considérer les données comme fraîches pendant 5 minutes
    refetchOnWindowFocus: true,
  });
} 