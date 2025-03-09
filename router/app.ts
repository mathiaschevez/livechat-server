import express from 'express';
import { messagesRouter } from './messages';
import cors from 'cors';
import { votesRouter } from './votes';
import { usersRouter } from './users';

export const app = express();

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

app.use('/messages', messagesRouter);
app.use('/votes', votesRouter);
app.use('/users', usersRouter)

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Catch-all route for 404 errors (optional)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.use((req, res, next) => {
  console.error('Error'); // Log the error for debugging
  res.status(500).json({ message: 'Something went wrong' }); // Send a generic error message to the client
});