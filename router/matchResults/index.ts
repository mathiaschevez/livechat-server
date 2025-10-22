import { Router } from 'express';
import { MatchResult, matchResultsCollection } from '../../mongo/client';

export const matchResultsRouter = Router();

matchResultsRouter.post('/', async (req, res) => {
  try {
    const rankItems = await matchResultsCollection.find(req.body).toArray();
    res.json(rankItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch match results' });
  }
});

matchResultsRouter.post('/insert', async (req, res) => {
  const matchResult: MatchResult = req.body.message;

  try {
    await matchResultsCollection.insertOne(matchResult);
    res.status(201).json({ message: 'Match Result inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert match result' });
  }
});
