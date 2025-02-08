import { User } from './user';
import { Channel } from './channel';

export interface Message {
  _id: string;
  content: string;
  sender: User;
  channel: Channel | string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
} 