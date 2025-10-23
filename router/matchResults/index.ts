// server/http/matchResultsRouter.ts
import { Router } from "express";
import { matchResultsCollection } from "../../mongo/client";
import { MatchResultDoc, MatchResultIn, MatchResultOut } from "../../types/socket";

export const matchResultsRouter = Router();

// Simple type guard (replace with zod/yup if you want)
function isMatchResultIn(x: any): x is MatchResultIn {
  return x && typeof x.round === "number"
    && typeof x.teamOne === "string"
    && typeof x.teamOneScore === "number"
    && typeof x.teamTwo === "string"
    && typeof x.teamTwoScore === "number"
    && typeof x.court === "number"
    && typeof x.eventSlug === "string"
    && typeof x.division === "string";
}

matchResultsRouter.post("/", async (req, res) => {
  try {
    // allow filter by eventSlug/division/etc
    const cursor = matchResultsCollection.find(req.body ?? {});
    const docs = await cursor.toArray() as MatchResultDoc[];
    const out: MatchResultOut[] = docs.map(d => ({ ...d, _id: d._id.toString() }));
    res.json(out);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch match results" });
  }
});

matchResultsRouter.post("/insert", async (req, res) => {
  const body = req.body?.message ?? req.body; // support either shape
  if (!isMatchResultIn(body)) {
    res.status(400).json({ message: "Invalid match result payload" });
  }

  try {
    const { insertedId } = await matchResultsCollection.insertOne(body);
    const out: MatchResultOut = { ...body, _id: insertedId.toString() };
    res.status(201).json({ ok: true, matchResult: out });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Failed to insert match result" });
  }
});
