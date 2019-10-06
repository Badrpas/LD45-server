import * as WebSocket from 'ws';
import * as path from 'path';
import { Server } from './server';
import { OPCODES, CLIENT_OPCODES } from './opcodes';
import { handlers } from './handlers';
import { Player } from './player';

export const ID_BYTES_COUNT = 2;
export const ID_MAX_VALUE = (1 << (8 * ID_BYTES_COUNT)) - 1;

export type ID = number;
export type OpCodeHandler = (client: Client, data: DataView) => void;

const debugBuffer = (buf: Buffer):string => Array.from(new Uint8Array(buf)).map(x => x.toString(16)).map(s => s.length === 1 ? ' ' + s : s).join(' ');

export class Client {

  private id: ID = this.generateId();

  constructor (public ws: WebSocket, private server: Server) {
    ws.on('message', (message: Buffer | string) => this.onMessage(message));
    ws.on('close', (message: Buffer | string) => this.onClose(message));
    ws.on('error', (message: Buffer | string) => this.onClose(message));
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
    new DataView(buf.buffer, buf.byteOffset).setUint16(1, this.id, true);

    ws.send(buf);
  }


  onClose (message: Buffer | string) {
    this.getClients().delete(this.id);
    const ab = new ArrayBuffer(3);
    const view = new DataView(ab);
    view.setUint8(0, OPCODES.removePlayer_s);
    view.setUint16(1, this.id, true);
    this.getServer().broadcast(ab);
  }

  private _player?: Player;
  
  get player (): Player {
    return this._player || (this._player = new Player);
  }

  getId(): number {
    return this.id;
  }

  getServer () : Server {
    return this.server;
  }

  onMessage (message: Buffer | string) {
    try {
      if (message instanceof Buffer) {
        console.log('received following buffer:', debugBuffer(message));
        this.processMessage(message);
      } else {
        console.log('What the heck is that he sending me?:');
        console.log(message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  processMessage (data: Buffer) {
    const view = new DataView(data.buffer, data.byteOffset);
    const opCode = view.getUint8(0);

    const handler = handlers.get(opCode);
  
    if (!handler) {
      throw new Error(`No handler found for ${OPCODES[opCode]} (${opCode})`);
    }
  
    handler(this, new DataView(data.buffer, data.byteOffset + 1));
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