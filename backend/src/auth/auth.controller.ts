import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../user/dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../user/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    await this.authService.logout(req.user._id);
    return { message: 'Déconnexion réussie' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req): Promise<User> {
    return req.user;
  }
} 