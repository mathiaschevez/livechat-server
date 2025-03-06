import express from 'express';
import { messagesRouter } from './messages';
import cors from 'cors';

export const app = express();

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

app.use('/messages', messagesRouter);

app.get('/', (req, res) => {
  res.send('Server is running'); // You can customize this message
});

// Catch-all route for 404 errors (optional)
app.use((req, res) => {
  res.status(404).send('Not Found');
});