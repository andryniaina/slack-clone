import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument, PopulatedMessage } from './schemas/message.schema';
import { User } from '../user/schemas/user.schema';
import { ChannelService } from '../channel/channel.service';
import { CreateMessageDto, UpdateMessageDto, GetMessagesQueryDto, AddReactionDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private channelService: ChannelService,
  ) {}

  async create(createMessageDto: CreateMessageDto, user: User): Promise<PopulatedMessage> {
    const { channelId, parentMessageId, mentions = [] } = createMessageDto;

    // Vérifier l'accès au canal
    await this.channelService.findOne(channelId, user);

    // Si c'est une réponse, vérifier que le message parent existe
    if (parentMessageId) {
      const parentMessage = await this.messageModel.findById(parentMessageId);
      if (!parentMessage) {
        throw new NotFoundException('Message parent non trouvé');
      }
    }

    const message = new this.messageModel({
      ...createMessageDto,
      sender: user._id,
      channel: channelId,
      parentMessage: parentMessageId,
      mentions,
      readBy: [user._id],
    });

    await message.save();

    // Mettre à jour l'horodatage du dernier message du canal
    await this.channelService.updateLastMessageTime(channelId);

    const savedMessage = await this.messageModel
      .findById(message._id)
      .populate('sender', 'email username avatar')
      .populate('mentions', 'email username avatar')
      .exec() as unknown as PopulatedMessage;

    if (!savedMessage) {
      throw new NotFoundException('Message non trouvé');
    }

    return savedMessage;
  }

  async findAll(query: GetMessagesQueryDto, user: User): Promise<PopulatedMessage[]> {
    const { channelId, limit = 50, before, after, parentMessageId } = query;

    // Vérifier l'accès au canal
    await this.channelService.findOne(channelId, user);

    const filter: any = { channel: channelId };

    if (parentMessageId) {
      filter.parentMessage = parentMessageId;
    } else {
      filter.parentMessage = { $exists: false };
    }

    if (before) {
      filter._id = { $lt: new Types.ObjectId(before) };
    }

    if (after) {
      filter._id = { ...filter._id, $gt: new Types.ObjectId(after) };
    }

    const messages = await this.messageModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .populate('sender', 'email username avatar')
      .populate('mentions', 'email username avatar')
      .populate('readBy', 'email username')
      .exec();

    return messages as unknown as PopulatedMessage[];
  }

  async findOne(id: string, user: User): Promise<PopulatedMessage> {
    const message = await this.messageModel
      .findById(id)
      .populate('sender', 'email username avatar')
      .populate('mentions', 'email username avatar')
      .populate('readBy', 'email username')
      .exec();

    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    // Vérifier l'accès au canal
    await this.channelService.findOne(message.channel.toString(), user);

    return message as unknown as PopulatedMessage;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, user: User): Promise<PopulatedMessage> {
    const message = await this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    // Vérifier l'accès au canal
    await this.channelService.findOne(message.channel.toString(), user);

    // Seul l'expéditeur peut modifier le message
    if (message.sender.toString() !== user._id.toString()) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce message');
    }

    message.content = updateMessageDto.content;
    message.isEdited = true;

    await message.save();

    const updatedMessage = await this.messageModel
      .findById(id)
      .populate('sender', 'email username avatar')
      .populate('mentions', 'email username avatar')
      .populate('readBy', 'email username')
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException('Message non trouvé');
    }

    return updatedMessage as unknown as PopulatedMessage;
  }

  async delete(id: string, user: User): Promise<void> {
    const message = await this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    // Vérifier l'accès au canal
    await this.channelService.findOne(message.channel.toString(), user);

    // Seul l'expéditeur peut supprimer le message
    if (message.sender.toString() !== user._id.toString()) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce message');
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();
  }

  async addReaction(id: string, addReactionDto: AddReactionDto, user: User): Promise<PopulatedMessage> {
    const message = await this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    // Vérifier l'accès au canal
    await this.channelService.findOne(message.channel.toString(), user);

    // Initialiser le tableau des réactions s'il n'existe pas
    if (!message.reactions) {
      message.reactions = [];
    }

    // Rechercher une réaction existante avec le même emoji
    const existingReactionIndex = message.reactions.findIndex(r => r.emoji === addReactionDto.emoji);

    if (existingReactionIndex > -1) {
      const reaction = message.reactions[existingReactionIndex];
      const userIndex = reaction.users.findIndex(u => u.toString() === user._id.toString());

      if (userIndex > -1) {
        // Supprimer la réaction de l'utilisateur si elle existe déjà
        reaction.users.splice(userIndex, 1);
        if (reaction.users.length === 0) {
          // Supprimer complètement la réaction s'il n'y a plus d'utilisateurs
          message.reactions.splice(existingReactionIndex, 1);
        }
      } else {
        // Ajouter la réaction de l'utilisateur
        reaction.users.push(user._id);
      }
    } else {
      // Ajouter une nouvelle réaction
      message.reactions.push({
        emoji: addReactionDto.emoji,
        users: [user._id],
      });
    }

    await message.save();

    const updatedMessage = await this.messageModel
      .findById(id)
      .populate('sender', 'email username avatar')
      .populate('mentions', 'email username avatar')
      .populate('readBy', 'email username')
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException('Message non trouvé');
    }

    return updatedMessage as unknown as PopulatedMessage;
  }

  async markAsRead(channelId: string, messageId: string, user: User): Promise<void> {
    // Vérifier l'accès au canal
    await this.channelService.findOne(channelId, user);

    await this.messageModel.updateMany(
      {
        channel: channelId,
        _id: { $lte: new Types.ObjectId(messageId) },
        readBy: { $ne: user._id },
      },
      {
        $addToSet: { readBy: user._id },
      },
    );
  }

  /**
   * Récupère tous les messages d'un canal spécifique
   * @param channelId ID du canal
   * @param options Options de pagination
   * @param user Utilisateur actuel
   */
  async getChannelMessages(
    channelId: string,
    options: { limit?: number; before?: string },
    user: User
  ): Promise<PopulatedMessage[]> {
    // Vérifier l'accès au canal
    await this.channelService.findOne(channelId, user);

    // Construire la requête
    const query: any = { channel: new Types.ObjectId(channelId) };
    
    // Ajouter la condition de pagination si 'before' est fourni
    if (options.before) {
      query._id = { $lt: new Types.ObjectId(options.before) };
    }

    // Effectuer la requête
    const messages = await this.messageModel
      .find(query)
      .sort({ _id: -1 }) // Tri par ordre chronologique inverse (plus récent d'abord)
      .limit(options.limit || 50) // Limite par défaut de 50 messages
      .populate('sender', 'email username avatar isOnline')
      .populate('mentions', 'email username avatar')
      .populate('readBy', 'email username')
      .exec();

    return messages as unknown as PopulatedMessage[];
  }
} 