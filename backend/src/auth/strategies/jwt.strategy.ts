import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Types } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'test-secret', 
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.userService.findById(new Types.ObjectId(payload.sub));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
} 