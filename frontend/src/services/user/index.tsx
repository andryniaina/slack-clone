import api from '../../utils/network/api';
import { User } from '../../data/dtos/user';

const USER_ENDPOINTS = {
  ME: '/auth/me',
  ALL: '/user',
  UPDATE_USERNAME: '/user/profile/username',
};

export const UserService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(USER_ENDPOINTS.ME);
    return response.data;
  },
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>(USER_ENDPOINTS.ALL);
    console.log("response", response.data);
    return response.data;
  },
  /**
   * Met à jour le nom d'utilisateur
   * @throws ConflictException si le nom d'utilisateur existe déjà
   */
  async updateUsername(username: string): Promise<User> {
    const response = await api.patch<User>(USER_ENDPOINTS.UPDATE_USERNAME, { username });
    return response.data;
  },
};

