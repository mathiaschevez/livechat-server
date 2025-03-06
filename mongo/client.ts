import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

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

export const messagesCollection = database.collection('messages');