import { Controller, Get, UseGuards, Patch, Body, Request, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUsernameDto, UpdatePasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

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

  @Patch('profile/password')
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;

    console.log("updatePasswordDto", updatePasswordDto);

    // Récupérer l'utilisateur avec son mot de passe actuel
    const user = await this.userService.findById(req.user._id);
    if (!user?.password) {
      throw new UnauthorizedException('Utilisateur non trouvé ou mot de passe non défini');
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Le mot de passe actuel est incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    return this.userService.updatePassword(req.user._id, hashedPassword);
  }
} 