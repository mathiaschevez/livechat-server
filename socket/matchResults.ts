import { Server, Socket } from "socket.io";
import { matchResultsCollection,  } from "../mongo/client";
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
}

export function registerMatchResults(io: Server<ClientToServerEvents, ServerToClientEvents>, socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
  socket.on('listenForMatchResults', async (eventSlug) => {
    console.log(`Client ${socket.id} listening to  results on ${eventSlug}`);
    socket.join(eventSlug);
  });

  socket.on('stopListeningForMatchResults', (eventSlug) => {
    console.log(`Client ${socket.id} stopped listening to match results on ${eventSlug}`);
    socket.leave(eventSlug);
  });

  socket.on("addMatchResult", async (matchResult) => {
    try {
      await matchResultsCollection.insertOne(matchResult);
      io.emit("addMatchResult", matchResult);
    } catch (err) {
      console.error('Error inserting match result into MongoDB:', err);
    }
  });

  // socket.on('removeMatchResult', async (matchResultId) => {
  //   try {
  //     await matchResultsCollection.deleteOne({ _id: matchResultId });
  //     io.emit('removeMatchResult', matchResultId);
  //   } catch (err) {
  //     console.error('Error removing match result from MongoDB:', err);
  //   }
  // });
}