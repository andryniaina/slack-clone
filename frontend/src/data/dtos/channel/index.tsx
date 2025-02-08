import { User } from '../user';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  DIRECT = 'direct'
}

export interface Channel {
  _id: string;
  name: string;
  type: ChannelType;
  description?: string;
  createdBy: User;
  members: User[];
  isArchived: boolean;
  admins: User[];
  participants?: User[];
  lastMessageAt?: Date;
} 