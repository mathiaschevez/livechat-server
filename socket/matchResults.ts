import type { Server, Socket } from "socket.io";
import { matchResultsCollection } from "../mongo/client";
import { ClientToServerEvents, MatchResultIn, MatchResultOut, ServerToClientEvents } from "../types/socket";


export function registerMatchResults(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("matchResult:listen", (eventSlug) => {
    socket.join(eventSlug);
    console.log(`[socket] ${socket.id} joined room ${eventSlug}`);
  });

  socket.on("matchResult:unlisten", (eventSlug) => {
    socket.leave(eventSlug);
    console.log(`[socket] ${socket.id} left room ${eventSlug}`);
  });

  socket.on("matchResult:add", async (doc: MatchResultIn, ack) => {
    try {
      // Optional: enforce uniqueness to avoid duplicates by court/round
      // await matchResultsCollection.createIndex(
      //   { eventSlug: 1, division: 1, round: 1, court: 1, teamOne: 1, teamTwo: 1 },
      //   { unique: true, name: "uniq_event_div_round_court_teams" }
      // );

      const { insertedId } = await matchResultsCollection.insertOne(doc);
      const out: MatchResultOut = { ...doc, _id: insertedId.toString() };

      // only notify clients in that event’s room
      io.to(doc.eventSlug).emit("matchResult:added", out);

      ack?.({ ok: true, id: out._id });
    } catch (err) {
      console.error("[socket] addMatchResult failed", err);
      ack?.({ ok: false, error: "DB_INSERT_FAILED" });
    }
  });

  // If you later implement removal:
  // socket.on("matchResult:remove", async ({ id, eventSlug }, ack) => {
  //   try {
  //     const _id = new ObjectId(id);
  //     await matchResultsCollection.deleteOne({ _id });
  //     io.to(eventSlug).emit("matchResult:removed", id);
  //     ack?.({ ok: true });
  //   } catch (e) {
  //     ack?.({ ok: false, error: "DB_DELETE_FAILED" });
  //   }
  // });
}
