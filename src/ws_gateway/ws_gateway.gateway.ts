import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsGatewayService } from './ws_gateway.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true, namespace: '/ws' }) // Required interfaces for handle connection and disconnect
export class WsGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss!: Server;

  constructor(private readonly wsGatewayService: WsGatewayService) {}

  handleConnection(client: Socket) {
    this.wsGatewayService.registerClient(client);
    this.wss.emit(
      'clients-updated',
      this.wsGatewayService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.wsGatewayService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.wsGatewayService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  catchClientMessage(client: Socket, payload: NewMessageDto) {
    console.log(client);
    console.log(payload);
  }
}
