import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsGatewayService } from './ws_gateway.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true, transports: ['websocket'], namespace: 'ws' }) // Required interfaces for handle connection and disconnect
export class WsGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly wsGatewayService: WsGatewayService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(args);
    console.log(client.id);
    return;
  }

  handleDisconnect(client: Socket) {
    console.log(client.id);
    return;
  }
}
