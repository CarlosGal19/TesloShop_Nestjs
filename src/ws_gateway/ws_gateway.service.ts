import { Injectable } from '@nestjs/common';
import { IConnectedClients } from './interfaces/ws-clients.interface';
import { Socket } from 'socket.io';

@Injectable()
export class WsGatewayService {
  private connectedClients: IConnectedClients = {};

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  removeClient(id: string) {
    delete this.connectedClients[id];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients);
  }
}
