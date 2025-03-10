import { Server, Socket } from "socket.io"
import { votesCollection } from "../mongo/client"

type Vote = {
  voteId: string,
  userId: string,
  rankItemId: number,
  rankingId: number,
  type: 'upvote' | 'downvote',
}

interface ClientToServerEvents {
  stopListeningForVotes: (rankingId: number) => void,
  listenForVotes: (rankingId: number) => void,
  vote: (vote: Vote) => void
}

type ServerToClientEvents = {
  vote: (vote: Vote) => void
}

export function registerVotes(io: Server<ClientToServerEvents, ServerToClientEvents> , socket: Socket<ClientToServerEvents, ServerToClientEvents> ) {
  socket.on('listenForVotes', rankingId => {
    console.log(`Client ${socket.id} listening to votes on ${rankingId}`);
    socket.join(rankingId.toString());
  });

  socket.on('stopListeningForVotes', (rankingId) => {
    console.log(`Client ${socket.id} stopped listening to votes on ${rankingId}`);
    socket.leave(rankingId.toString());
  })

  socket.on('vote', async (vote) => {
    try {
      await votesCollection
        .updateOne(
          { voteId: vote.voteId },
          { $set: { 
            rankingId: vote.rankingId,
            rankItemId: vote.rankItemId,
            userId: vote.userId,
            type: vote.type,
          } },
          { upsert: true }
        );
      
      io.in(vote.rankingId.toString()).emit("vote", vote); // Broadcast message to clients listening to ranking id
    } catch (err) {
      console.error('Error inserting message into MongoDB:', err);
    }
  })
}