import { Server, Socket } from "socket.io"
import { rankingsCollection, rankItemsCollection, votesCollection } from "../mongo/client"
import { ObjectId } from "mongodb"

type Vote = {
  voteId: string,
  userId: string,
  userEmail: string,
  rankItemId: number,
  rankingId: number,
  type: 'upvote' | 'downvote',
}

interface ClientToServerEvents {
  stopListeningForVotes: (rankingId: number) => void,
  listenForVotes: (rankingId: number) => void,
  vote: (vote: Vote) => void
  unvote: (vote: Vote) => void
}

type ServerToClientEvents = {
  vote: (vote: Vote) => void;
  unvote: (unvote: Vote) => void;
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

  socket.on('vote', async (vote: Vote) => {
    try {
      const operations = [
        votesCollection.updateOne(
          { voteId: vote.voteId },
          {
            $set: {
              rankingId: vote.rankingId,
              rankItemId: vote.rankItemId,
              userId: vote.userId,
              userEmail: vote.userEmail,
              type: vote.type,
            },
          },
          { upsert: true }
        ),
        rankingsCollection.updateOne(
          { _id: new ObjectId(vote.rankingId) },
          { $inc: { voteCount: 1 } }
        ),
        rankItemsCollection.updateOne(
          { _id: new ObjectId(vote.rankItemId) },
          { $inc: { [vote.type === 'upvote' ? 'upvotes' : 'downvotes']: 1 } }
        ),
      ];

      await Promise.all(operations);

      io.in(vote.rankingId.toString()).emit('vote', vote);
    } catch (err) {
      console.error('Error inserting vote into MongoDB:', err);
    }
  });

  socket.on('unvote', async (vote: Vote) => {
    try {
      const operations = [
        votesCollection.deleteOne({ voteId: vote.voteId }),
        rankingsCollection.updateOne(
          { _id: new ObjectId(vote.rankingId) },
          { $inc: { voteCount: -1 } }
        ),
        rankItemsCollection.updateOne(
          { _id: new ObjectId(vote.rankItemId) },
          { $inc: { [vote.type === 'upvote' ? 'upvotes' : 'downvotes']: -1 } }
        ),
      ];

      await Promise.all(operations);

      io.in(vote.rankingId.toString()).emit('unvote', vote);
    } catch (err) {
      console.error('Error deleting vote from MongoDB:', err);
    }
  });
}