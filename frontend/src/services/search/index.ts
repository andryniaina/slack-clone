import { Channel } from '../../data/dtos/channel';
import { User } from '../../data/dtos/user';
import { ChannelService } from '../channel';
import { UserService } from '../user';

export interface SearchResult {
  type: 'channel' | 'user';
  item: Channel | User;
}

export const SearchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const [channels, users] = await Promise.all([
      ChannelService.getAccessibleChannels(),
      UserService.getAllUsers(),
    ]);


    const searchQuery = query.toLowerCase();

    // Filtrer et formater les canaux
    const channelResults = channels
      .filter(channel => channel.name.toLowerCase().includes(searchQuery))
      .map(channel => ({ type: 'channel' as const, item: channel }));

    // Filtrer et formater les utilisateurs
    const userResults = users
      .filter(user => 
        (user.username?.toLowerCase().includes(searchQuery) || 
        user.email.toLowerCase().includes(searchQuery))
      )
      .map(user => ({ type: 'user' as const, item: user }));

    // Combiner et limiter les résultats
    return [...channelResults, ...userResults].slice(0, 5);
  }
};
