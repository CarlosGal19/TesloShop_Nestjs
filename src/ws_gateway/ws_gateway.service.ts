import { Injectable } from '@nestjs/common';
import { IConnectedClients } from './interfaces/ws-clients.interface';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WsGatewayService {
  private connectedClients: IConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) throw new Error('User not found');
    if (!user.is_active) throw new Error('User not active');

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return `${this.connectedClients[socketId].user.name} ${this.connectedClients[socketId].user.lastName}`;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.user_id === user.user_id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
