
import { Server, Data } from 'ws';

const wss = new Server({ port: 3377 });

var lastGivenId = 0;

enum TYPE {
  location = 1,
  action = 2,
  identification = 3
}

const fillZeros = (s: string) => s.length === 1 ? '0' + s : s;

wss.on('connection', function connection(ws) {
  const clientId = generate_id();
  ws.on('message', function incoming(message: Data) {
    if (message instanceof Buffer) {
      console.log(`It's a Buffer yo`);

      const buf = new Uint8Array(message)
      if (buf[0] === TYPE.location) {
        console.log("location")
      } else if (buf[0] === TYPE.action) {
        console.log("action")
      } else {
        console.log("WTH is this type?!")
      }

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
  ws.send('your id: ' + clientId)
  var buf = new Uint8Array(2);
  buf[0] = TYPE.identification;
  buf[1] = clientId;
  ws.send(buf);
});

function generate_id() {
  return lastGivenId++;
}