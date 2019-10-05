import { Client, CLIENT_OPCODES, ID, ID_BYTES_COUNT } from './client';
import * as WebSocket from 'ws';

export class Server {

  private clients = new Map<ID, Client>();

  constructor (private wss: WebSocket.Server) {
    wss.on('connection', (ws: WebSocket) => {
      console.log('yoba connected');
      const client = new Client(ws, this);
      this.broadcastNewClient(client);
    });
  }

  broadcastNewClient (client: Client) {
    const data = new Uint8Array(ID_BYTES_COUNT);
    new DataView(data).setUint16(0, client.getId(), true);
    this.broadcast(data, client);
  }

  broadcast(data: ArrayBuffer | Buffer, omitedClient?: Client) {
    for (let client of this.clients.values()) {
      if (client !== omitedClient) {
        client.getWs().send(data);
      }
    }
  }

  getClients (): Map<ID, Client> {
    return this.clients;
  }

}