import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { SeederModule } from './seeder/seeder.module';
import { AppBootstrapService } from './app.bootstrap.service';
import { appConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('app.database.url'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    MessageModule,
    SeederModule,
  ],
  providers: [AppBootstrapService],
})
export class AppModule {}
