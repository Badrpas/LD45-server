
import { Server, Data } from 'ws';

const wss = new Server({ port: 3377 });

const fillZeros = (s: string) => s.length === 1 ? '0' + s : s;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message: Data) {
    if (message instanceof Buffer) {
      console.log(`It's a Buffer yo`);

      const data = Array.from(new Uint8Array(message))
                      .map(x => x.toString(16))
                      .map(fillZeros)
                      .join(' ');

      console.log(data);

      this.send(data);
      this.send(message);
    } else {
      console.log('What the heck is that he sending me?:');
      console.log(message);
    }
  });

  console.log('yoba connected');
  ws.send('Welcome to Pornhub');
  ws.send(`Here's your favorite video ;-)`);
});