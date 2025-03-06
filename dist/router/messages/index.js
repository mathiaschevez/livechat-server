import { Router } from 'express';
import { messagesCollection } from '../../mongo/client';
export const messagesRouter = Router();
messagesRouter.post('/', async (req, res) => {
    const messages = await messagesCollection
        .find()
        .toArray();
    res.json(messages);
});
messagesRouter.post('/insert', async (req, res) => {
    const message = req.body.message;
    messagesCollection.insertOne({ message });
});
