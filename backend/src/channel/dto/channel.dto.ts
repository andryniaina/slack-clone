import { IsString, IsEnum, IsOptional, IsArray, IsMongoId, IsBoolean, ArrayMinSize } from 'class-validator';
import { ChannelType } from '../schemas/channel.schema';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: string[];
}

export class UpdateChannelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}

export class AddMembersDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  memberIds: string[];
}

export class RemoveMembersDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  memberIds: string[];
}

export class CreateDirectMessageDto {
  @IsMongoId()
  participantId: string;
}

export class ChannelQueryDto {
  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsString()
  @IsOptional()
  search?: string;
} 