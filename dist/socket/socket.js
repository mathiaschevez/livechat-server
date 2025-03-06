"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const socket_io_1 = require("socket.io");
const client_1 = require("../mongo/client");
async function listen(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN_URL, // Allow frontend to connect
            methods: ["GET", "POST"]
        }
    });
    // Change Stream for real-time updates
    // const changeStream = messages.watch();
    // changeStream.on("change", next => {
    //   if (next.operationType === 'insert') {
    //     io.emit('chat message', next.fullDocument?.message);
    //   }
    // });
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("chat message", async (msg) => {
            await client_1.messagesCollection.insertOne({ message: msg });
            io.emit("chat message", msg); // Broadcast message to all clients
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
    io.engine.on("connection_error", (err) => {
        console.log(err.req); // the request object
        console.log(err.code); // the error code, for example 1
        console.log(err.message); // the error message, for example "Session ID unknown"
        console.log(err.context); // some additional error context
    });
}
const socket = { listen };
exports.socket = socket;
