import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Channel, ChannelSchema } from './schemas/channel.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Channel.name, schema: ChannelSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {} 