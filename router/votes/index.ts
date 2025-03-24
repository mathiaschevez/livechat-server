import { Router } from 'express';
import { messagesCollection, votesCollection } from '../../mongo/client';

export const votesRouter = Router();

votesRouter.post('/', async (req: { body: { rankingId: string } }, res) => {
  const { rankingId } = req.body;

  try {
    const votes = await votesCollection
      .find({ rankingId: rankingId })
      .toArray();

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

votesRouter.post('/delete', async (req, res) => {
  try {
    await votesCollection.deleteMany(req.body);
    res.json({ message: 'Votes deleted successfully' });
  } catch (err) {
    console.error('Error deleting votes from MongoDB:', err);
  }
})

