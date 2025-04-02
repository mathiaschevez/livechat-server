import { Router } from 'express';
import { usersCollection } from '../../mongo/client';

export const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const userId = req.body.userId;

  try {
    const users = await usersCollection.find({ userId }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

usersRouter.post('/insert', async (req, res) => {
  const user = req.body;

  try {
    await usersCollection.insertOne(user);
    res.status(201).json({ message: 'User inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert user' });
  }
});

usersRouter.post('/save-ranking', async (req, res) => {
  const { userId, rankingId } = req.body;

  try {
    await usersCollection.findOneAndUpdate({ userId }, { $push: { savedRankings: rankingId }})
    res.status(201).json({ message: 'Ranking saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save ranking' });
  }
})

usersRouter.post('/remove-saved-ranking', async (req, res) => {
  const { userId, rankingId } = req.body;

  try {
    await usersCollection.findOneAndUpdate({ userId }, { $pull: { savedRankings: rankingId }})
    res.status(201).json({ message: 'Ranking un saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to un saved ranking' });
  }
})