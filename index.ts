import { socket } from './socket/socket';
import http from 'http';
import { app } from './router/app';

const server = http.createServer(app);
const PORT = 8000;
socket.listen(server);

server.listen(PORT, () => {
  console.log('listening on *:8000');
});
