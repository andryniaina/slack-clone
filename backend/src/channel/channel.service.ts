import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Channel, ChannelDocument, ChannelType, PopulatedChannel } from './schemas/channel.schema';
import { User } from '../user/schemas/user.schema';
import { CreateChannelDto, UpdateChannelDto, AddMembersDto, RemoveMembersDto, CreateDirectMessageDto, ChannelQueryDto } from './dto/channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async create(createChannelDto: CreateChannelDto, user: User): Promise<PopulatedChannel> {
    const { name, type, description, members = [] } = createChannelDto;

    // Vérifier si un canal avec ce nom existe déjà
    const existingChannel = await this.channelModel.findOne({ name, type });
    if (existingChannel) {
      throw new ConflictException('Un canal avec ce nom existe déjà');
    }

    // Créer le canal
    const channel = new this.channelModel({
      name,
      type,
      description,
      createdBy: user._id,
      members: [...new Set([user._id.toString(), ...members])], // Assurer l'unicité des membres
      admins: [user._id],
    });

    await channel.save();

    const savedChannel = await this.channelModel
      .findById(channel._id)
      .populate('members', 'email username avatar isOnline')
      .populate('createdBy', 'email username')
      .exec();

    if (!savedChannel) {
      throw new NotFoundException('Canal non trouvé');
    }

    return savedChannel as unknown as PopulatedChannel;
  }

  async createDirectMessage(createDirectMessageDto: CreateDirectMessageDto, user: User): Promise<PopulatedChannel> {
    const { participantId } = createDirectMessageDto;

    // Vérifier si un canal de messages directs existe déjà entre ces utilisateurs
    const existingDM = await this.channelModel
      .findOne({
        type: ChannelType.DIRECT,
        participants: { $all: [user._id, participantId] },
      })
      .populate('members', 'email username avatar isOnline')
      .populate('createdBy', 'email username')
      .exec();

    if (existingDM) {
      return existingDM as unknown as PopulatedChannel;
    }

    // Créer un nouveau canal de messages directs
    const channel = new this.channelModel({
      name: `dm-${user._id}-${participantId}`,
      type: ChannelType.DIRECT,
      createdBy: user._id,
      members: [user._id, participantId],
      participants: [user._id, participantId],
    });

    await channel.save();

    const savedChannel = await this.channelModel
      .findById(channel._id)
      .populate('members', 'email username avatar isOnline')
      .populate('createdBy', 'email username')
      .exec();

    if (!savedChannel) {
      throw new NotFoundException('Canal non trouvé');
    }

    return savedChannel as unknown as PopulatedChannel;
  }

  async findAll(user: User, query: ChannelQueryDto): Promise<PopulatedChannel[]> {
    const { type, isArchived, search } = query;
    const filter: any = {
      members: user._id,
    };

    if (type) {
      filter.type = type;
    }

    if (typeof isArchived === 'boolean') {
      filter.isArchived = isArchived;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const channels = await this.channelModel
      .find(filter)
      .populate('members', 'email username avatar isOnline')
      .populate('createdBy', 'email username')
      .sort({ lastMessageAt: -1 })
      .exec();

    return channels as unknown as PopulatedChannel[];
  }

  async findOne(id: string, user: User): Promise<PopulatedChannel> {
    const channel = await this.channelModel
      .findOne({ _id: id, members: user._id })
      .populate('members', 'email username avatar isOnline')
      .populate('createdBy', 'email username')
      .exec();

    if (!channel) {
      throw new NotFoundException('Canal non trouvé');
    }

    return channel as unknown as PopulatedChannel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto, user: User): Promise<PopulatedChannel> {
    const channel = await this.channelModel.findOne({ _id: id, members: user._id });

    if (!channel) {
      throw new NotFoundException('Canal non trouvé');
    }

    if (!channel.admins.includes(user._id)) {
      throw new ForbiddenException('Vous n\'avez pas les droits pour modifier ce canal');
    }

    const updatedChannel = await this.channelModel
      .findByIdAndUpdate(id, { $set: updateChannelDto }, { new: true })
      .populate('members', 'email username avatar isOnline')
      .exec();

    if (!updatedChannel) {
      throw new NotFoundException('Canal non trouvé');
    }

    return updatedChannel as unknown as PopulatedChannel;
  }

  async addMembers(id: string, addMembersDto: AddMembersDto, user: User): Promise<PopulatedChannel> {
    const channel = await this.channelModel.findOne({ _id: id, members: user._id });

    if (!channel) {
      throw new NotFoundException('Canal non trouvé');
    }

    if (channel.type === ChannelType.DIRECT) {
      throw new ForbiddenException('Impossible d\'ajouter des membres à un message direct');
    }

    if (!channel.admins.includes(user._id)) {
      throw new ForbiddenException('Vous n\'avez pas les droits pour ajouter des membres');
    }

    const updatedChannel = await this.channelModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { members: { $each: addMembersDto.memberIds } } },
        { new: true },
      )
      .populate('members', 'email username avatar isOnline')
      .exec();

    if (!updatedChannel) {
      throw new NotFoundException('Canal non trouvé');
    }

    return updatedChannel as unknown as PopulatedChannel;
  }

  async removeMembers(id: string, removeMembersDto: RemoveMembersDto, user: User): Promise<PopulatedChannel> {
    const channel = await this.channelModel.findOne({ _id: id, members: user._id });

    if (!channel) {
      throw new NotFoundException('Canal non trouvé');
    }

    if (channel.type === ChannelType.DIRECT) {
      throw new ForbiddenException('Impossible de retirer des membres d\'un message direct');
    }

    if (!channel.admins.includes(user._id)) {
      throw new ForbiddenException('Vous n\'avez pas les droits pour retirer des membres');
    }

    // Empêcher la suppression du dernier administrateur
    const remainingAdmins = channel.admins.filter(
      adminId => !removeMembersDto.memberIds.includes(adminId.toString()),
    );

    if (remainingAdmins.length === 0) {
      throw new ForbiddenException('Impossible de retirer le dernier administrateur');
    }

    const updatedChannel = await this.channelModel
      .findByIdAndUpdate(
        id,
        { 
          $pull: { 
            members: { $in: removeMembersDto.memberIds },
            admins: { $in: removeMembersDto.memberIds }
          } 
        },
        { new: true },
      )
      .populate('members', 'email username avatar isOnline')
      .exec();

    if (!updatedChannel) {
      throw new NotFoundException('Canal non trouvé');
    }

    return updatedChannel as unknown as PopulatedChannel;
  }

  async leave(id: string, user: User): Promise<void> {
    const channel = await this.channelModel.findOne({ _id: id, members: user._id });

    if (!channel) {
      throw new NotFoundException('Canal non trouvé');
    }

    if (channel.type === ChannelType.DIRECT) {
      throw new ForbiddenException('Impossible de quitter un message direct');
    }

    // Vérifier si l'utilisateur est le dernier administrateur
    if (
      channel.admins.includes(user._id) &&
      channel.admins.length === 1 &&
      channel.members.length > 1
    ) {
      throw new ForbiddenException('Veuillez désigner un autre administrateur avant de quitter le canal');
    }

    await this.channelModel.findByIdAndUpdate(id, {
      $pull: { members: user._id, admins: user._id },
    });
  }

  async delete(id: string, user: User): Promise<void> {
    const channel = await this.channelModel.findOne({ _id: id, admins: user._id });

    if (!channel) {
      throw new NotFoundException('Canal non trouvé ou vous n\'avez pas les droits pour le supprimer');
    }

    if (channel.type === ChannelType.DIRECT) {
      throw new ForbiddenException('Impossible de supprimer un message direct');
    }

    await this.channelModel.findByIdAndDelete(id);
  }

  async updateLastMessageTime(channelId: string): Promise<void> {
    await this.channelModel.findByIdAndUpdate(channelId, {
      lastMessageAt: new Date(),
    });
  }

  async findUserChannels(userId: Types.ObjectId): Promise<Channel[]> {
    return this.channelModel
      .find({ members: userId })
      .sort({ updatedAt: -1 })
      .exec();
  }
} 