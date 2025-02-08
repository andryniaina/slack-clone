import api from '../../utils/network/api';
import { Message } from '../../data/dtos/message';

const MESSAGE_ENDPOINTS = {
  BASE: '/messages',
  CHANNEL: (channelId: string) => `/messages/channel/${channelId}`,
  SEND: '/messages/send',
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

  /**
   * Envoie un message dans un canal
   * @param channelId ID du canal
   * @param content Contenu du message
   * @param parentMessageId ID du message parent (optionnel)
   */
  async sendMessage(
    channelId: string,
    content: string,
    parentMessageId?: string
  ): Promise<Message[]> {
    const response = await api.post<Message[]>(MESSAGE_ENDPOINTS.SEND, {
      channelId,
      content,
      parentMessageId,
    });
    return response.data;
  },
};
