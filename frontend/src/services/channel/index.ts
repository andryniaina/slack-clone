import api from '../../utils/network/api';
import { Channel } from '../../data/dtos/channel';
import { User } from '../../data/dtos/user';

const CHANNEL_ENDPOINTS = {
  BASE: '/channels',
  DIRECT: '/channels/direct',
};

export const ChannelService = {
  /**
   * Récupère tous les canaux de l'utilisateur connecté
   * @param type Type de canal (optionnel)
   */
  async getUserChannels(type?: 'public' | 'private' | 'direct'): Promise<Channel[]> {
    const response = await api.get<Channel[]>(CHANNEL_ENDPOINTS.BASE, {
      params: { type },
    });
    return response.data;
  },

  /**
   * Récupère ou crée un canal de messages directs avec un utilisateur
   * @param participantId ID de l'utilisateur avec qui créer le canal
   */
  async getOrCreateDirectChannel(participantId: string): Promise<Channel> {
    const response = await api.post<Channel>(CHANNEL_ENDPOINTS.DIRECT, {
      participantId,
    });
    return response.data;
  },

  /**
   * Initialise les canaux de messages directs pour tous les utilisateurs
   * @param users Liste des utilisateurs
   */
  async initializeDirectChannels(users: User[]): Promise<Channel[]> {
    try {
      // Créer les canaux en parallèle
      const channelPromises = users.map(user => 
        this.getOrCreateDirectChannel(user._id.toString())
      );
      
      const channels = await Promise.all(channelPromises);
      return channels;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des canaux directs:', error);
      return [];
    }
  },

  /**
   * Récupère tous les canaux de messages directs
   */
  async getAllDirectChannels(): Promise<Channel[]> {
    return this.getUserChannels('direct');
  },
};
