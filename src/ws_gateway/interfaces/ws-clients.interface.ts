import { Socket } from 'socket.io';

export interface IConnectedClients {
  [id: string]: Socket;
}
