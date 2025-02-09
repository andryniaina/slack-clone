import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto, UpdateProfileDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

interface FindAllOptions {
  excludeSystem?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, username } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new this.userModel({
      email,
      password: hashedPassword,
      username,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(userId: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async updateProfile(userId: Types.ObjectId, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateProfileDto, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async setOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isOnline });
  }

  /**
   * Récupère tous les utilisateurs
   * @param options Options de filtrage
   * @returns Liste des utilisateurs avec leurs informations de base
   */
  async findAll(options: FindAllOptions = {}): Promise<User[]> {
    const query = this.userModel.find();

    if (options.excludeSystem) {
      query.where('email').ne('system@koto.sa');
    }

    const users = await query.exec();
    return users;
  }

  async addSocketId(userId: Types.ObjectId, socketId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { socketIds: socketId } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async removeSocketId(userId: Types.ObjectId, socketId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { socketIds: socketId } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findBySocketId(socketId: string): Promise<User | null> {
    return this.userModel.findOne({ socketIds: socketId });
  }

  async updateOnlineStatus(userId: Types.ObjectId, isOnline: boolean): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { isOnline },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Trouve un utilisateur par son nom d'utilisateur
   */
  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * Met à jour le nom d'utilisateur
   */
  async updateUsername(userId: string, username: string) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { username },
        { new: true }
      )
      .select('-password')
      .exec();
  }

  /**
   * Met à jour le mot de passe d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param hashedPassword Nouveau mot de passe hashé
   * @returns L'utilisateur mis à jour
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: { password: hashedPassword } },
        { new: true }
      )
      .select('-password')
      .exec();
      
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    
    return user;
  }
} 