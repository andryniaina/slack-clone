import api from '../../utils/network/api';
import { User } from '../../data/dtos/user';

const USER_ENDPOINTS = {
  ME: '/auth/me',
  ALL: '/user',
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
};

