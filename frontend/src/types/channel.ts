import { User } from './user';

export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: string[];
  admins: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelWithMembers extends Omit<Channel, 'members' | 'admins'> {
  members: User[];
  admins: User[];
}

export interface ChannelInvite {
  channelId: string;
  userId: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ChannelMember {
  userId: string;
  channelId: string;
  role: 'member' | 'admin';
  joinedAt: string;
} 