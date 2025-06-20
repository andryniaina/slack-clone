import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  username?: string;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop({ type: [String], default: [] })
  socketIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User); 