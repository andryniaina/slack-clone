import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';
import { MessageService } from '../message.service';
import { UserService } from '../../user/user.service';
import { ChannelService } from '../../channel/channel.service';
import { Types } from 'mongoose';
import { WsUser } from '../../auth/decorators/ws-user.decorator';
import { User } from '../../user/schemas/user.schema';

interface SendMessageDto {
  content: string;
  channelId: string;
  parentMessageId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket, @WsUser() user: User) {
    // Ajouter le socketId à l'utilisateur
    await this.userService.addSocketId(user._id, client.id);
    await this.userService.updateOnlineStatus(user._id, true);

    // Rejoindre tous les canaux de l'utilisateur
    const channels = await this.channelService.findUserChannels(user._id);
    channels.forEach((channel) => {
      client.join(channel._id.toString());
    });
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Retirer le socketId de l'utilisateur
    const user = await this.userService.findBySocketId(client.id);
    if (user) {
      await this.userService.removeSocketId(user._id, client.id);
      
      // Mettre à jour le statut en ligne si c'est la dernière connexion
      const updatedUser = await this.userService.findById(user._id);
      if (updatedUser?.socketIds.length === 0) {
        await this.userService.updateOnlineStatus(user._id, false);
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @WsUser() user: User,
    @MessageBody() data: SendMessageDto,
  ) {
    try {
      // Vérifier si l'utilisateur est membre du canal
      const channel = await this.channelService.findOne(data.channelId, user);
      if (!channel) {
        client.emit('error', { message: 'Canal non trouvé' });
        return;
      }

      const isMember = channel.members.some((member) => 
        member.toString() === user._id.toString()
      );
      
      if (!isMember) {
        client.emit('error', { message: 'Vous n\'êtes pas membre de ce canal' });
        return;
      }

      // Créer le message
      const message = await this.messageService.create({
        content: data.content,
        channelId: data.channelId,
        parentMessageId: data.parentMessageId,
      }, user);

      // Récupérer le message avec les relations peuplées
      const populatedMessage = await this.messageService.findOne(message._id.toString(), user);

      // Émettre le message à tous les membres du canal
      this.server.to(data.channelId).emit('newMessage', populatedMessage);

      return populatedMessage;
    } catch (error) {
      client.emit('error', { message: 'Erreur lors de l\'envoi du message' });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @WsUser() user: User,
    @MessageBody() data: { channelId: string; isTyping: boolean },
  ) {
    const { channelId, isTyping } = data;
    
    // Émettre l'état de frappe aux autres membres du canal
    client.to(channelId).emit('userTyping', {
      userId: user._id,
      username: user.username || user.email,
      isTyping,
    });
  }
} 