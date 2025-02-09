import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { AppInitService } from './app.init.service';
import { User, UserSchema } from './user/schemas/user.schema';
import { Channel, ChannelSchema } from './channel/schemas/channel.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/slack'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Channel.name, schema: ChannelSchema }
    ]),
    AuthModule,
    UserModule,
    ChannelModule,
    MessageModule,
  ],
  providers: [AppInitService],
})
export class AppModule {}
