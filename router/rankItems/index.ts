import { Router } from 'express';
import { rankingsCollection, rankItemsCollection, usersCollection } from '../../mongo/client';
import { ObjectId } from 'mongodb';

export const rankItemsRouter = Router();

rankItemsRouter.post('/', async (req, res) => {
  try {
    const rankItems = await rankItemsCollection.find(req.body).toArray();
    res.json(rankItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rank items' });
  }
});

rankItemsRouter.post('/insert', async (req, res) => {
  const itemsToInsert = req.body.rankItems

  try {
    await rankItemsCollection.insertMany(itemsToInsert);
    res.status(201).json({ message: 'Rank items inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert rank items' });
  }
});

rankItemsRouter.post('/update', async (req, res) => {
  const { rankItemId, updates } = req.body;

  try {
    const result = await rankItemsCollection.updateOne(
      { _id: new ObjectId(rankItemId) },
      {
        $set: updates,
        $currentDate: { lastModified: true }
      }
    );

    if (result.modifiedCount === 0) {
       console.warn(`No rank item found with id: ${rankItemId} or no changes applied.`);
      res.status(404).json({ message: `Rank item not found or no updates applied for id: ${rankItemId}` });
    } else {
      res.status(200).json({ message: `Ranking updated successfully: ${rankItemId}`, result });
    }
  } catch (error) {
    console.error("Error updating ranking:", error);

    res.status(500).json({ message: `Failed to update rankItem: ${rankItemId}` });
  }
});

rankItemsRouter.post('/delete', async (req, res) => {
  const { rankItemId } = req.body;

  if (!rankItemId) res.status(400).json({ message: "Missing rankItemId" });

  try {
    const result = await rankItemsCollection.findOneAndDelete({ _id: new ObjectId(rankItemId) });

    if (!result.value) res.status(404).json({ message: "Rank item not found" });

    console.log("Deleted rank item:", result.value);
    res.json({ message: "Deleted rank item successfully", deletedDoc: result.value });
  } catch (error) {
    console.error("Failed to delete rank item:", error);
    res.status(500).json({ message: "Failed to delete rank item" });
  }
});

rankItemsRouter.post('/deleteMany', async (req, res) => {
  try {
    await rankItemsCollection.deleteMany(req.body);
    res.json({ message: 'Deleted rank items successfully' });
    return 
  } catch (error) {
    res.status(500).json({ message: `Failed to delete rank items: ${req.body}`})
  }
})