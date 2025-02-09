import { Controller, Get, UseGuards, Patch, Body, Request, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUsernameDto } from './dto/auth.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Récupère la liste de tous les utilisateurs sauf le compte système
   * @returns Liste des utilisateurs avec leurs informations de base
   */
  @Get()
  findAll() {
    return this.userService.findAll({ excludeSystem: true });
  }

  /**
   * Met à jour le nom d'utilisateur
   * @throws ConflictException si le nom d'utilisateur existe déjà
   */
  @Patch('profile/username')
  async updateUsername(@Request() req, @Body() updateUsernameDto: UpdateUsernameDto) {
    console.log("updateUsernameDto", updateUsernameDto);
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = await this.userService.findByUsername(updateUsernameDto.username);
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
    }

    // Mettre à jour le nom d'utilisateur
    return this.userService.updateUsername(req.user._id, updateUsernameDto.username);
  }
} 