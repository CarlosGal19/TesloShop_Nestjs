import { Socket } from 'socket.io';
import { User } from '../../auth/entities/user.entity';

export interface IConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}
