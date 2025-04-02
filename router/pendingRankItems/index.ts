import { Router } from "express";
import { pendingRankItemsCollection } from "../../mongo/client";

export const pendingRankItemsRouter = Router();

pendingRankItemsRouter.post('/', async (req, res) => {
  try {
    const rankItems = await pendingRankItemsCollection.find(req.body).toArray();
    res.json(rankItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rank items' });
  }
});

pendingRankItemsRouter.post('/insert', async (req, res) => {
  const itemsToInsert = req.body.rankItems

  try {
    await pendingRankItemsCollection.insertMany(itemsToInsert);
    res.status(201).json({ message: 'Rank items inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert rank items' });
  }
});