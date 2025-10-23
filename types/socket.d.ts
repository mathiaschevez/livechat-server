// server/types/matchResults.ts
import type { WithId, ObjectId } from "mongodb";

export type MatchResultIn = {
  round: number;
  teamOne: string;
  teamOneScore: number;
  teamTwo: string;
  teamTwoScore: number;
  court: number;
  eventSlug: string;
  division: string;
};

export type MatchResultDoc = WithId<MatchResultIn>; // has _id: ObjectId

export type MatchResultOut = MatchResultIn & { _id: string }; // normalized for clients

export interface ClientToServerEvents {
  "matchResult:listen":   (eventSlug: string) => void;
  "matchResult:unlisten": (eventSlug: string) => void;
  "matchResult:add": (
    payload: MatchResultIn,
    ack?: (res: { ok: true; id: string } | { ok: false; error: string }) => void
  ) => void;
  // you can add remove/update variations later
}

export interface ServerToClientEvents {
  "matchResult:added": (payload: MatchResultOut) => void;
}
