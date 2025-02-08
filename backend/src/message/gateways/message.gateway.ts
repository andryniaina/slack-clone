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
import { MessageService } from '../message.service';
import { UserService } from '../../user/user.service';
import { ChannelService } from '../../channel/channel.service';
import { Types } from 'mongoose';

interface SendMessageDto {
  content: string;
  channelId: string;
  parentMessageId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected:', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected:', client.id);
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

  @SubscribeMessage('connect_user')
  async handleUserConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string
  ) {
    try {
      const user = await this.userService.findById(new Types.ObjectId(userId));
      if (!user) {
        client.emit('error', { message: 'Utilisateur non trouvé' });
        client.disconnect();
        return;
      }

      // Ajouter le socketId à l'utilisateur
      await this.userService.addSocketId(user._id, client.id);
      await this.userService.updateOnlineStatus(user._id, true);

      // Rejoindre tous les canaux de l'utilisateur
      const channels = await this.channelService.findUserChannels(user._id);
      channels.forEach((channel) => {
        client.join(channel._id.toString());
      });

      client.data.user = user;
      client.emit('connect_confirmed');
      
      console.log('User connected:', user.email);
    } catch (error) {
      console.error('Connection error:', error);
      client.emit('error', { message: 'Erreur de connexion' });
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    try {
      const user = client.data.user;
      if (!user) {
        client.emit('error', { message: 'Utilisateur non authentifié' });
        return;
      }

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
    @MessageBody() data: { channelId: string; isTyping: boolean },
  ) {
    const user = client.data.user;
    if (!user) return;

    const { channelId, isTyping } = data;
    
    // Émettre l'état de frappe aux autres membres du canal
    client.to(channelId).emit('userTyping', {
      userId: user._id,
      username: user.username || user.email,
      isTyping,
    });
  }
} 