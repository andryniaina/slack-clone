import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from '../user/dto/auth.dto';
import { ChannelService } from '../channel/channel.service';
import { ChannelType } from '../channel/schemas/channel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel, ChannelDocument } from '../channel/schemas/channel.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.userService.create(registerDto);

      await this.channelModel.updateMany(
        { type: ChannelType.PUBLIC },
        { $addToSet: { members: user._id } }
      );

      const token = this.generateToken(user._id.toString());
      return { token };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Cette adresse e-mail est déjà utilisée');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    await this.userService.setOnlineStatus(user._id.toString(), true);
    const token = this.generateToken(user._id.toString());
    return { token };
  }

  async logout(userId: string) {
    await this.userService.setOnlineStatus(userId, false);
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }
} 