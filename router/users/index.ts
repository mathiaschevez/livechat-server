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
