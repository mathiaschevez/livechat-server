import { socket } from './socket/socket';
import http from 'http';
import { app } from './router/app';
const server = http.createServer(app);
socket.listen(server);
server.listen(process.env.PORT, () => {
    console.log('listening on *:8000');
});
