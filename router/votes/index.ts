import { Router } from 'express';
import { messagesCollection, votesCollection } from '../../mongo/client';

export const votesRouter = Router();

votesRouter.get('/', async (req, res) => {
  try {
    const votes = await votesCollection.find().toArray();
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch votes' });
  }
});

votesRouter.post('/insert', async (req, res) => {
  const vote = req.body;

  try {
    await votesCollection.insertOne({ vote });
    res.status(201).json({ message: 'Vote inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert vote' });
  }
});
