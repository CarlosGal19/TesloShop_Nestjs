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
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true, namespace: '/ws' }) // Required interfaces for handle connection and disconnect
export class WsGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss!: Server;

  constructor(
    private readonly wsGatewayService: WsGatewayService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: IJwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.wsGatewayService.registerClient(client, payload.user.user_id);
    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }

    // console.log({ payload })
    // console.log('Cliente conectado:', client.id );

    // this.wss.emit(
    //   'clients-updated',
    //   this.messagesWsService.getConnectedClients(),
    // );
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
    // emit message-from-server -- payload: { fullName: string, message: string }
    this.wss.emit('message-from-server', {
      fullName: this.wsGatewayService.getUserFullName(client.id),
      message: payload.message ?? 'no message',
    });
    // If you use client.emits the message will be received just for the user that emitted it
    // client.broadcast emits a message for everyone except the client
    // client.join joins a client to a room
  }
}
