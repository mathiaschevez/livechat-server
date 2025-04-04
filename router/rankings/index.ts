import { Router } from 'express';
import { rankingsCollection, usersCollection } from '../../mongo/client';
import { ObjectId } from 'mongodb';

export const rankingsRouter = Router();

rankingsRouter.post('/', async (req, res) => {
  try {
    const rankings = await rankingsCollection.find().toArray();
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rankings' });
  }
});

rankingsRouter.post('/user', async (req, res) => {
  try {
    const rankings = await rankingsCollection.find(req.body).toArray();
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rankings' });
  }
});

rankingsRouter.post('/ranking', async (req, res) => {
  const rankingId = req.body.rankingId;
  
  try {
    const rankings = await rankingsCollection.findOne({ _id: new ObjectId(rankingId) });
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ranking' });
  }
});

rankingsRouter.post('/insert', async (req, res) => {
  const ranking = req.body;

  try {
    const result = await rankingsCollection.insertOne(ranking);
    res.status(201).json({ message: 'Inserted ranking successfully', insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert ranking' });
  }
});

rankingsRouter.post('/update', async (req, res) => {
  const { rankingId, updates } = req.body;

  try {
    const result = await rankingsCollection.updateOne(
      { _id: new ObjectId(rankingId) },
      {
        $set: updates,
        $currentDate: { lastModified: true }
      }
    );

    if (result.modifiedCount === 0) {
       console.warn(`No ranking found with id: ${rankingId} or no changes applied.`);
      res.status(404).json({ message: `Ranking not found or no updates applied for id: ${rankingId}` });
    }

    res.status(200).json({ message: `Ranking updated successfully: ${rankingId}`, result });
  } catch (error) {
    console.error("Error updating ranking:", error);

    res.status(500).json({ message: `Failed to update ranking: ${rankingId}` });
  }
});

rankingsRouter.post('/delete', async (req, res) => {
  const { rankingId } = req.body;

  if (!rankingId) res.status(400).json({ message: "Missing rankingId" });

  try {
    const deletedRanking = await rankingsCollection.findOneAndDelete({ _id: new ObjectId(rankingId) });

    if (!deletedRanking.value) res.status(404).json({ message: "Ranking not found" });
    
    res.json({ message: "Deleted ranking successfully", deletedDoc: deletedRanking.value });
  } catch (error) {
    console.error("Failed to delete ranking:", error);
    res.status(500).json({ message: `Failed to delete ranking` });
  }
});
