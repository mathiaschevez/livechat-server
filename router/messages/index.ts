import { Router } from 'express'
import { messagesCollection } from '../../mongo/client';

export const messagesRouter = Router();

messagesRouter.post('/insert', async (req, res) => {
  const message = req.body.message;
  messagesCollection.insertOne({ message });
})