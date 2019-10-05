
import { Server, Data } from 'ws';

const wss = new Server({ port: 3377 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message: Data) {
    if (message instanceof Buffer) {
      console.log(`It's a Buffer yo`);

      const data = new Uint8Array(message).map(String).join(' ');
      console.log(data);
      
      this.send(data);
    }
  });

  console.log('yoba connected');
  ws.send('Welcome to Pornhub');
  ws.send(`Here's your favorite video :-)`);
  ws.send(new Buffer('Kappa'));
});