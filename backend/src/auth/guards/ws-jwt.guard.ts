import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from '../../user/user.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHeader(client);
      
      if (!token) {
        throw new WsException('Token non fourni');
      }

      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findById(payload.sub);
      
      if (!user) {
        throw new WsException('Utilisateur non trouvé');
      }

      // Attacher l'utilisateur au socket
      client['user'] = user;
      
      return true;
    } catch (err) {
      throw new WsException('Token non valide');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const auth = client.handshake.auth.token || client.handshake.headers.authorization;
    if (!auth) return undefined;
    
    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
} 