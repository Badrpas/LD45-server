import * as WebSocket from 'ws';
import * as path from 'path';
import { Server } from './server';
import { OPCODES, CLIENT_OPCODES } from './opcodes';

export const ID_BYTES_COUNT = 2;
export const ID_MAX_VALUE = (1 << (8 * ID_BYTES_COUNT)) - 1;

export type ID = number;
export type OpCodeHandler = (client: Client, data: Buffer) => void;

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
  
    var buf = new Uint8Array(1 + ID_BYTES_COUNT);
    buf[0] = OPCODES.identification_s;
    new DataView(buf).setUint16(1, this.id, true);
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