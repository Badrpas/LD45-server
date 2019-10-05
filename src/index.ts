
import { Server, Data } from 'ws';

const wss = new Server({
  port: 3377
});


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message: Data) {
    console.log('received: %s', message);
    this.send(message);
  });

  ws.send('something');
});