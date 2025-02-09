import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Channel, ChannelSchema } from '../channel/schemas/channel.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Channel.name, schema: ChannelSchema }
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {} 