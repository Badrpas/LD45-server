import * as WebSocket from 'ws';
import * as path from 'path';
import { Server } from './server';

export const ID_BYTES_COUNT = 2;
export const ID_MAX_VALUE = (1 << (8 * ID_BYTES_COUNT)) - 1;

export type ID = number;
export type OpCodeHandler = (client: Client, data: Buffer) => void;

// From client to server
export enum CLIENT_OPCODES {
  location = 0,
  action
}

// From server -> client
export enum SERVER_OPCODES {
  /**
   * Sending ID for new user to identify him
   */
  identification = 0, 
  /**
   * Sends player ids. Called for new player with
   * all existing and broadcasted for all on new player conneciton
   */
  addPlayer,
  /**
   * For new connection sends coordinate of other users
   * Broadcast for others coord of the player
   */
  location,
  action,
  removePlayer
}


export class Client {

  private id: ID = this.generateId();

  constructor (public ws: WebSocket, private server: Server) {
    ws.on('message', (message: Buffer | string) => this.onMessage(message));
    this.getClients().set(this.id, this);

    this.sendHelloMessage();
  }

  sendHelloMessage () {
    const { ws } = this;

    ws.send('Welcome to Pornhub');
    ws.send(`Here's your favorite video ;-)`);
    ws.send('your id: ' + this.id);
  
    var buf = new Uint8Array(2);
    buf[0] = SERVER_OPCODES.identification;
    buf[1] = this.id;
    ws.send(buf);
  }

  getId(): number {
    return this.id;
  }

  getServer () : Server {
    return this.server;
  }

  onMessage (message: Buffer | string) {
    if (message instanceof Buffer) {
      console.log(`It's a Buffer yo`);
      this.processMessage(message);
    } else {
      console.log('What the heck is that he sending me?:');
      console.log(message);
    }
  }

  processMessage (data: Buffer) {
    const buf = new DataView(data, 0, 1);
    const opCode = buf.getUint8(0);
  
    const typeValue = <CLIENT_OPCODES>opCode;
    const typeKey = CLIENT_OPCODES[typeValue];

    const handlerModulePath = path.join('handlers', typeKey);
    const handler: OpCodeHandler = require(handlerModulePath).handler;
  
    if (!handler) {
      throw new Error(`No handler found for ${CLIENT_OPCODES[typeValue]} (${opCode})`);
    }
  
    handler(this, data);
  }

  getClients (): Map<ID, Client> {
    return this.server.getClients();
  }

  generateId() : ID {
    const clients = this.getClients();
    if (clients.size >= ID_MAX_VALUE) {
      throw new Error('Kek xyek no spots go fk urslf :^)');
    }
  
    let id = 0;
    while (clients.get(id)) id++;
  
    return id;
  }

  getWs () {
    return this.ws;
  }

}