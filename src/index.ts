
import * as WebSocket from 'ws';
// import { Client, OPCODES } from './client';
import { Server } from './server';

const wss = new WebSocket.Server({ port: 3377 });

new Server(wss);

