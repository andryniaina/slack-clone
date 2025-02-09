import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user/schemas/user.schema';
import { Channel, ChannelDocument, ChannelType } from './channel/schemas/channel.schema';

@Injectable()
export class AppInitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppInitService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  /**
   * Cette méthode est automatiquement appelée une fois que l'application est initialisée
   * et que tous les modules sont chargés
   */
  async onApplicationBootstrap() {
    try {
      this.logger.log('Initialisation de l\'application...');
      
      // Réinitialiser les états de connexion des utilisateurs
      await this.resetUserConnectionStates();
      
      // Créer les canaux par défaut
      await this.createDefaultChannels();
      
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
      throw error;
    }
  }

  /**
   * Crée les canaux publics par défaut s'ils n'existent pas déjà
   */
  private async createDefaultChannels(): Promise<void> {
    try {
      // Récupérer tous les utilisateurs pour les ajouter comme membres
      const allUsers = await this.userModel.find({});
      const userIds = allUsers.map(user => user._id);

      // Utiliser le premier utilisateur comme créateur des canaux par défaut
      // ou créer un utilisateur système si aucun utilisateur n'existe
      let systemUser = allUsers[0];
      if (!systemUser) {
        systemUser = await this.userModel.create({
          email: 'system@koto.sa',
          password: 'systemPassword123!',
          username: 'Système',
          isOnline: false
        });
        userIds.push(systemUser._id);
      }

      const defaultChannels = [
        {
          name: 'tous',
          description: 'Canal général pour toute l\'entreprise',
          type: ChannelType.PUBLIC,
          createdBy: systemUser._id,
          members: userIds,
          admins: [systemUser._id]
        },
        {
          name: 'social',
          description: 'Canal pour les discussions sociales et informelles',
          type: ChannelType.PUBLIC,
          createdBy: systemUser._id,
          members: userIds,
          admins: [systemUser._id]
        }
      ];
      
      for (const channelData of defaultChannels) {
        // Vérifier si le canal existe déjà
        const existingChannel = await this.channelModel.findOne({ 
          name: channelData.name,
          type: ChannelType.PUBLIC 
        });

        if (!existingChannel) {
          // Créer le canal s'il n'existe pas
          await this.channelModel.create(channelData);
          this.logger.log(`Canal public "${channelData.name}" créé avec succès avec ${userIds.length} membres`);
        } else {
          // Mettre à jour les membres si le canal existe déjà
          await this.channelModel.findByIdAndUpdate(
            existingChannel._id,
            { $addToSet: { members: { $each: userIds } } }
          );
          this.logger.log(`Le canal "${channelData.name}" a été mis à jour avec les nouveaux membres`);
        }
      }
    } catch (error) {
      this.logger.error('Erreur lors de la création des canaux par défaut:', error);
      throw error;
    }
  }
} 