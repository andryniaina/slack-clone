import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Récupère la liste de tous les utilisateurs
   * @returns Liste des utilisateurs avec leurs informations de base
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }
} 