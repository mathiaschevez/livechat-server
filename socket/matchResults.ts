import { Server, Socket } from "socket.io";
import { messagesCollection } from "../mongo/client";

interface ClientToServerEvents {
  matchResult: (message: string) => void
}

type ServerToClientEvents = {
  matchResult: (message: string) => void
}

export function registerMessages(io: Server<ClientToServerEvents, ServerToClientEvents>, socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
  socket.on("matchResult", async (matchResult) => {
    try {
      await messagesCollection.insertOne({ matchResult: matchResult });
      io.emit("matchResult", matchResult);
    } catch (err) {
      console.error('Error inserting match result into MongoDB:', err);
    }
  });
}