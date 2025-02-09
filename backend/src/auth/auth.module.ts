import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Channel, ChannelSchema } from '../channel/schemas/channel.schema';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: Channel.name, schema: ChannelSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'test-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {} 