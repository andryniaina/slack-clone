import { IsString, IsEnum, IsOptional, IsArray, IsMongoId, IsNumber } from 'class-validator';
import { MessageType } from '../schemas/message.schema';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsMongoId()
  channelId: string;

  @IsMongoId()
  @IsOptional()
  parentMessageId?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  mentions?: string[];
}

export class UpdateMessageDto {
  @IsString()
  content: string;
}

export class GetMessagesQueryDto {
  @IsMongoId()
  channelId: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  before?: string; // ID du message ou horodatage

  @IsString()
  @IsOptional()
  after?: string; // ID du message ou horodatage

  @IsMongoId()
  @IsOptional()
  parentMessageId?: string;
}

export class AddReactionDto {
  @IsString()
  emoji: string;
}

export class FileMetadataDto {
  @IsString()
  url: string;

  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsString()
  type: string;
} 