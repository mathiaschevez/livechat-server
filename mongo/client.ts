import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING ?? '', {
  replicaSet: 'rs0',
  retryWrites: true,
  ignoreUndefined: true
});
client.connect().catch(console.error);

const database = client.db('livechat');

export const messagesCollection = database.collection('messages');