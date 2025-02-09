import { User } from './user';

export interface Message {
  _id: string;
  content: string;
  sender: string;
  channelId: string;
  replyTo?: string;
  attachments?: string[];
  reactions?: MessageReaction[];
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
}

export interface MessageWithSender extends Omit<Message, 'sender'> {
  sender: User;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
}

export interface MessageAttachment {
  _id: string;
  url: string;
  type: 'image' | 'video' | 'file';
  name: string;
  size: number;
  mimeType: string;
}

export interface MessageThread {
  messageId: string;
  replies: Message[];
  participantsCount: number;
  lastReplyAt: string;
} 