import { Server, Socket } from "socket.io";
import { messagesCollection } from "../mongo/client";

interface ClientToServerEvents {
  chatMessage: (message: string) => void
}

type ServerToClientEvents = {
  chatMessage: (message: string) => void
}

export function registerMessages(io: Server<ClientToServerEvents, ServerToClientEvents>, socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
  socket.on("chatMessage", async (message) => {
    try {
      await messagesCollection.insertOne({ message: message });
      io.emit("chatMessage", message); // Broadcast message to all clients
    } catch (err) {
      console.error('Error inserting message into MongoDB:', err);
    }
  });
}