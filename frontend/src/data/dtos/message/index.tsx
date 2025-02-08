import { User } from '../user';

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  SYSTEM = 'system'
}

export interface Message {
  _id: string;
  content: string;
  type: MessageType;
  sender: User;
  channel: string;
  parentMessage?: string;
  mentions?: User[];
  readBy: User[];
  fileMetadata?: {
    url: string;
    name: string;
    size: number;
    type: string;
  };
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  reactions?: {
    emoji: string;
    users: User[];
  }[];
  createdAt: Date;
  updatedAt: Date;
} 