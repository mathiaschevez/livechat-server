import type http from 'http';
import { Server } from 'socket.io';
import { messagesCollection } from '../mongo/client';

async function listen(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN_URL, // Allow frontend to connect
      methods: ["GET", "POST"]
    }
  });

  // Change Stream for real-time updates (this part should also be handled)
  // const changeStream = messages.watch();
  // changeStream.on("change", next => {
  //   if (next.operationType === 'insert') {
  //     io.emit('chat message', next.fullDocument?.message);
  //   }
  // });

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("chat message", async (msg) => {
      try {
        await messagesCollection.insertOne({ message: msg });
        io.emit("chat message", msg); // Broadcast message to all clients
      } catch (err) {
        console.error('Error inserting message into MongoDB:', err);
        socket.emit("error", "Could not save message.");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  io.engine.on("connection_error", (err) => {
    console.error('Socket connection error:', err.message);
    console.error('Error details:', err);
  });
}

const socket = { listen };

export { socket };
