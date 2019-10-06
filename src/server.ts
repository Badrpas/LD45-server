import { Client, ID, ID_BYTES_COUNT } from './client';
import { OPCODES } from "./opcodes";
import * as WebSocket from 'ws';

const FPS = 60;

export class Server {

  private clients = new Map<ID, Client>();

  constructor (private wss: WebSocket.Server) {
    wss.on('connection', (ws: WebSocket) => {
      console.log('yoba connected');
      const client = new Client(ws, this);
      this.broadcastNewClient(client);
    });

    setInterval(() => this.update(), 1000 / FPS);
  }

  update() {
    const clients = [...this.clients]
                        .filter(([id, client]) => client.player.position.needsUpdate)
                        .map(([id, client]) => client);
    if (!clients.length) return;

    const arrBuf = new ArrayBuffer(1 + 6 * clients.length);
    new DataView(arrBuf, 0, 1).setUint8(0, OPCODES.location_s);
    
    clients.reduce((view, client, index) => {
      view.setUint16(index * 6 + 0, client.getId(), true);
      view.setUint16(index * 6 + 2, client.player.position.x, true);
      view.setUint16(index * 6 + 4, client.player.position.y, true);
      client.player.position.needsUpdate = false;
      return view;
    }, new DataView(arrBuf, 1));

    this.broadcast(Buffer.from(arrBuf));

    const clients_action = [...this.clients]
      .filter(([id, client]) => client.player.action.needsUpdate)
      .map(([id, client]) => client);
    if (!clients_action.length) return;

    const arrBufAction = new ArrayBuffer(1 + 7 * clients_action.length);
    new DataView(arrBufAction, 0, 1).setUint8(0, OPCODES.action_s);

    clients_action.reduce((view, client, index) => {
      view.setUint16(index * 7 + 0, client.getId(), true);
      view.setUint16(index * 7 + 2, client.player.action.x, true);
      view.setUint16(index * 7 + 4, client.player.action.y, true);
      view.setUint8(index * 7 + 6, client.player.action.action);
      client.player.action.needsUpdate = false;
      return view;
    }, new DataView(arrBufAction, 1));

    this.broadcast(Buffer.from(arrBufAction));
  }


  broadcastNewClient (client: Client) {
    const data = new Uint8Array(1 + ID_BYTES_COUNT);
    data[0] = OPCODES.addPlayer_s;
    new DataView(data.buffer).setUint16(1, client.getId(), true);
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