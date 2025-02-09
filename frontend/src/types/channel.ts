export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  type: ChannelType;
  createdBy: string;
  members: string[];
  admins: string[];
  createdAt: string;
  updatedAt: string;
} 