import api from '../../utils/network/api';
import { User } from '../../data/dtos/user';

const USER_ENDPOINTS = {
  ME: '/auth/me',
};

export const UserService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(USER_ENDPOINTS.ME);
    return response.data;
  },
};
