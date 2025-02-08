import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type ChannelDocument = Channel & Document;

// Type pour le canal avec les champs peuplés
export type PopulatedChannel = Omit<Channel, 'createdBy' | 'members' | 'admins' | 'participants'> & {
  createdBy: User;
  members: User[];
  admins: User[];
  participants?: User[];
};

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  DIRECT = 'direct'
}

@Schema({ timestamps: true })
export class Channel {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ChannelType, default: ChannelType.PUBLIC })
  type: ChannelType;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  admins: Types.ObjectId[];

  // Pour les messages directs, on stocke les participants
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  participants?: Types.ObjectId[];

  // Horodatage du dernier message pour le tri
  @Prop()
  lastMessageAt?: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

// Index pour améliorer les performances des requêtes
ChannelSchema.index({ name: 1, type: 1 }, { unique: true });
ChannelSchema.index({ members: 1 });
ChannelSchema.index({ participants: 1 });
ChannelSchema.index({ lastMessageAt: -1 }); 