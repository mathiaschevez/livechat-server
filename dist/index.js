"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket/socket");
const http_1 = __importDefault(require("http"));
const app_1 = require("./router/app");
const server = http_1.default.createServer(app_1.app);
socket_1.socket.listen(server);
server.listen(process.env.PORT, () => {
    console.log('listening on *:8000');
});
