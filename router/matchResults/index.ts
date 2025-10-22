import { Router } from 'express';
import { matchResultsCollection } from '../../mongo/client';

export const matchResultsRouter = Router();

matchResultsRouter.get('/', async (req, res) => {
  try {
    const matchResults = await matchResultsCollection.find().toArray();
    res.json(matchResults);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch match results' });
  }
});

matchResultsRouter.post('/insert', async (req, res) => {
  const matchResult = req.body.message;

  try {
    await matchResultsCollection.insertOne({ matchResult });
    res.status(201).json({ message: 'Match Result inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert match result' });
  }
});
