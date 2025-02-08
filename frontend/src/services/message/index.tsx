import api from '../../utils/network/api';
import { Message } from '../../data/dtos/message';

const MESSAGE_ENDPOINTS = {
  BASE: '/messages',
  CHANNEL: (channelId: string) => `/messages/channel/${channelId}`,
};

export const MessageService = {
  /**
   * Récupère tous les messages d'un canal
   * @param channelId ID du canal
   * @param options Options de pagination
   */
  async getChannelMessages(
    channelId: string,
    options?: { limit?: number; before?: string }
  ): Promise<Message[]> {
    const response = await api.get<Message[]>(
      MESSAGE_ENDPOINTS.CHANNEL(channelId),
      { params: options }
    );
    return response.data;
  },
};
