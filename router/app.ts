import express from 'express';
import { messagesRouter } from './messages';
import cors from 'cors';

export const app = express();

// Enable CORS for all requests
app.use(cors({
  origin: process.env.CLIENT_ORIGIN_URL,
  credentials:true,
}));
app.use(express.json());


app.use('/messages', messagesRouter);