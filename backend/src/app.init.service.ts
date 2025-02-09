import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user/schemas/user.schema';

@Injectable()
export class AppInitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppInitService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Cette méthode est automatiquement appelée une fois que l'application est initialisée
   * et que tous les modules sont chargés
   */
  async onApplicationBootstrap() {
    try {
      this.logger.log('Initialisation de l\'application...');
      await this.resetUserConnectionStates();
      this.logger.log('Initialisation terminée avec succès');
    } catch (error) {
      this.logger.error('Erreur lors de l\'initialisation de l\'application:', error);
      // Ne pas faire crasher l'application, mais logger l'erreur
    }
  }

  /**
   * Réinitialise les états de connexion de tous les utilisateurs
   * - Met isOnline à false
   * - Vide le tableau socketIds
   */
  private async resetUserConnectionStates(): Promise<void> {
    try {
      const result = await this.userModel.updateMany(
        {}, // Tous les utilisateurs
        {
          $set: { isOnline: false },
          $unset: { socketIds: [] }
        }
      );

      this.logger.log(`États de connexion réinitialisés pour ${result.modifiedCount} utilisateurs`);
    } catch (error) {
      this.logger.error('Erreur lors de la réinitialisation des états de connexion:', error);
      throw error; // Propager l'erreur pour la gestion globale
    }
  }
} 