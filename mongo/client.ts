import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

export type MatchResult = {
  round: number
  teamOne: string
  teamOneScore: number
  teamTwo: string
  teamTwoScore: number
  court: number
  eventSlug: string,
  division: string,
}

config();

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING ?? '', {
  retryWrites: true,
  ignoreUndefined: true,
});

async function connectMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
}

connectMongo();

const database = client.db('livechat');

export const usersCollection = database.collection('users');
export const messagesCollection = database.collection('messages');
export const votesCollection = database.collection('votes');
export const rankingsCollection = database.collection('rankings');
export const rankItemsCollection = database.collection('rankItems');
export const pendingRankItemsCollection = database.collection('pendingRankItems');

export const matchResultsCollection = database.collection<MatchResult>('matchResults');