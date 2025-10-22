import { Server, Socket } from "socket.io";
import { matchResultsCollection, messagesCollection } from "../mongo/client";
import { ObjectId, WithId } from "mongodb";

type MatchResult = {
  _id: ObjectId,
  round: number,
  teamOne: string,
  teamOneScore: number,
  teamTwo: string,
  teamTwoScore: number,
  court: number,
  eventSlug: string,
  division: string
}

interface ClientToServerEvents {
  stopListeningForMatchResults: (eventSlug: string) => void,
  listenForMatchResults: (eventSlug: string) => void,
  addMatchResult: (matchResult: MatchResult) => void
  removeMatchResult: (matchResultId: string) => void,
}

type ServerToClientEvents = {
  addMatchResult: (matchResult: MatchResult) => void
  removeMatchResult: (matchResultId: string) => void;
  sendMatchResults: (matchResults: WithId<MatchResult>[]) => void;
}

export function registerMatchResults(io: Server<ClientToServerEvents, ServerToClientEvents>, socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
  socket.on('listenForMatchResults', async (eventSlug) => {
    console.log(`Client ${socket.id} listening to votes on ${eventSlug}`);
    socket.join(eventSlug);
    try {
      const matchResults = await matchResultsCollection.find({ eventSlug: eventSlug }).toArray();
      io.emit("sendMatchResults", matchResults); // Placeholder for future implementation
    } catch (err) {
      console.error('Error fetching match results from MongoDB:', err);
    }
  });

  socket.on('stopListeningForMatchResults', (eventSlug) => {
    console.log(`Client ${socket.id} stopped listening to votes on ${eventSlug}`);
    socket.leave(eventSlug);
  });

  socket.on("addMatchResult", async (matchResult) => {
    try {
      await messagesCollection.insertOne({ matchResult: matchResult });
      io.emit("addMatchResult", matchResult);
    } catch (err) {
      console.error('Error inserting match result into MongoDB:', err);
    }
  });

  socket.on('removeMatchResult', async (matchResultId) => {
    try {
      await messagesCollection.deleteOne({ _id: matchResultId });
      io.emit('removeMatchResult', matchResultId);
    } catch (err) {
      console.error('Error removing match result from MongoDB:', err);
    }
  });
}