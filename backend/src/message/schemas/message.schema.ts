import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Channel } from '../../channel/schemas/channel.schema';

export type MessageDocument = Message & Document;

// Type pour le message avec les champs peuplés
export type PopulatedMessage = Omit<Message, 'sender' | 'mentions' | 'readBy'> & {
  sender: User;
  mentions?: User[];
  readBy: User[];
};

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  SYSTEM = 'system'
}

@Schema({ timestamps: true })
export class Message {
  _id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Channel', required: true })
  channel: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  parentMessage?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  mentions?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  readBy: Types.ObjectId[];

  @Prop({ type: Object })
  fileMetadata?: {
    url: string;
    name: string;
    size: number;
    type: string;
  };

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop([{
    emoji: String,
    users: [{ type: Types.ObjectId, ref: 'User' }]
  }])
  reactions?: {
    emoji: string;
    users: Types.ObjectId[];
  }[];

  @Prop({ type: Object })
  metadata?: {
    [key: string]: any;
  };
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Index pour améliorer les performances des requêtes
MessageSchema.index({ channel: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ mentions: 1 });
MessageSchema.index({ parentMessage: 1 }); 