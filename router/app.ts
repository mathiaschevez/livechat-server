import express from 'express';
import { messagesRouter } from './messages';
import cors from 'cors';

export const app = express();

// Enable CORS for all requests
app.use(cors({
  origin: process.env.CLIENT_ORIGIN_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN_URL ?? ''); // Allow the frontend to connect
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, etc.)
  next(); // Pass to the next middleware or route handler
});


app.use('/messages', messagesRouter);

app.get('/', (req, res) => {
  res.send('Server is running'); // You can customize this message
});

// Catch-all route for 404 errors (optional)
app.use((req, res) => {
  res.status(404).send('Not Found');
});