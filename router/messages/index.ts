import { Router } from 'express';
import { messagesCollection } from '../../mongo/client';

export const messagesRouter = Router();

// GET /messages to fetch all messages
messagesRouter.get('/', async (req, res) => {
  try {
    const messages = await messagesCollection.find().toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// POST /messages/insert to insert a new message
messagesRouter.post('/insert', async (req, res) => {
  const message = req.body.message;

  try {
    await messagesCollection.insertOne({ message });
    res.status(201).json({ message: 'Message inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert message' });
  }
});
