// Grokmate client state: a pure fold over the relay's event stream (apps/relay/PROTOCOL.md).
// Nothing here knows more than the relay sent this viewer, so anonymity is not this file's job to keep.

export type AskKind = "study" | "teammate" | "coffee" | "cofounder" | "advice";
export type Look = { skin?: number; hair?: number; style?: number; top?: number; glasses?: boolean };
export type User = { id: string; name: string; place: string; kind: "you" | "real" | "persona"; look?: Look };
export type Line = { from: string; text?: string; withheld?: string };
export type Verdict = { fit: number; fitReason: string; willing: boolean; willingReason: string };
export type Conv = { convId: string; askId: string; alias: string; you?: boolean; lines: Line[]; verdict?: Verdict; started: boolean };
export type Brief = { why: string; talkAbout: string[] };
export type Person = { id: string; name: string };
export type Match = {
  matchId: string; askId: string; convId: string; alias: string; rank: number; brief: Brief;
  awaiting: "asker" | "offerer" | null; status: "proposed" | "revealed" | "declined"; asker?: Person; offerer?: Person;
};
export type Meeting = {
  meetingId: string; matchId: string; askId: string; slot: string;
  approved: { asker?: boolean; offerer?: boolean }; status: "proposed" | "scheduled" | "asked" | "confirmed"; happened?: boolean;
};
export type Ask = {
  askId: string; kind: AskKind; seats: number; spot: string; mine: boolean; text?: string;
  status: "scouting" | "talking" | "matching" | "open" | "filled"; convIds: string[];
};
export type State = {
  users: Record<string, User>; asks: Record<string, Ask>; convs: Record<string, Conv>;
  matches: Record<string, Match>; meetings: Record<string, Meeting>; askOrder: string[];
};
export type GrokmateEvent = { seq: number; type: string; at: number | string } & Record<string, any>;

export const empty = (): State => ({ users: {}, asks: {}, convs: {}, matches: {}, meetings: {}, askOrder: [] });

export function reduce(s: State, e: GrokmateEvent): State {
  const ask = (id: string, patch: Partial<Ask>) => (s.asks[id] ? { ...s.asks, [id]: { ...s.asks[id], ...patch } } : s.asks);
  const conv = (id: string, f: (c: Conv) => Conv) => (s.convs[id] ? { ...s.convs, [id]: f(s.convs[id]) } : s.convs);
  switch (e.type) {
    case "node.joined":
      return { ...s, users: { ...s.users, [e.user.id]: e.user } };
    case "ask.posted":
      return {
        ...s, askOrder: [...s.askOrder.filter((x) => x !== e.askId), e.askId],
        asks: { ...s.asks, [e.askId]: { askId: e.askId, kind: e.kind, seats: e.seats, spot: e.spot, mine: !!e.mine, text: e.text, status: "scouting", convIds: [] } },
      };
    case "scout.picked": {
      const convs = { ...s.convs };
      for (const c of e.candidates) convs[c.convId] = { convId: c.convId, askId: e.askId, alias: c.alias, you: !!c.you, lines: [], started: false };
      return { ...s, convs, // a re-scored ask picks up extra candidates, so add to the list
      asks: ask(e.askId, { status: "talking", convIds: [...new Set([...(s.asks[e.askId]?.convIds ?? []), ...e.candidates.map((c: any) => c.convId)])] }) };
    }
    case "conv.started":
      return { ...s, convs: conv(e.convId, (c) => ({ ...c, started: true })) };
    case "conv.message":
      return { ...s, convs: conv(e.convId, (c) => ({ ...c, started: true, lines: [...c.lines, { from: e.from, text: e.text }] })) };
    case "conv.withheld":
      return { ...s, convs: conv(e.convId, (c) => ({ ...c, started: true, lines: [...c.lines, { from: e.from, withheld: e.topic }] })) };
    case "conv.verdict":
      return { ...s, convs: conv(e.convId, (c) => ({ ...c, verdict: { fit: e.fit, fitReason: e.fitReason, willing: e.willing, willingReason: e.willingReason } })) };
    case "match.proposed": {
      const prev = s.matches[e.matchId];
      return {
        ...s, asks: ask(e.askId, { status: "matching" }),
        matches: { ...s.matches, [e.matchId]: { ...prev, matchId: e.matchId, askId: e.askId, convId: e.convId, alias: e.alias, rank: e.rank, brief: e.brief, awaiting: e.awaiting, status: "proposed" } },
      };
    }
    case "match.approved": {
      const m = s.matches[e.matchId]; if (!m) return s;
      return { ...s, matches: { ...s.matches, [e.matchId]: { ...m, awaiting: e.by === "asker" ? "offerer" : null } } };
    }
    case "match.declined": {
      const m = s.matches[e.matchId]; if (!m) return s;
      return { ...s, matches: { ...s.matches, [e.matchId]: { ...m, awaiting: null, status: "declined" } } };
    }
    case "match.revealed": {
      const m = s.matches[e.matchId] ?? { matchId: e.matchId, askId: e.askId, convId: e.convId, alias: e.alias, rank: 0, brief: e.brief };
      return { ...s, matches: { ...s.matches, [e.matchId]: { ...m, brief: e.brief ?? m.brief, awaiting: null, status: "revealed", asker: e.asker, offerer: e.offerer } as Match } };
    }
    case "ask.open": return { ...s, asks: ask(e.askId, { status: "open" }) };
    case "ask.filled": return { ...s, asks: ask(e.askId, { status: "filled" }) };
    case "meeting.proposed":
      return { ...s, meetings: { ...s.meetings, [e.meetingId]: { meetingId: e.meetingId, matchId: e.matchId, askId: e.askId, slot: e.slot, approved: {}, status: "proposed" } } };
    case "meeting.approved": {
      const m = s.meetings[e.meetingId]; if (!m) return s;
      return { ...s, meetings: { ...s.meetings, [e.meetingId]: { ...m, approved: { ...m.approved, [e.by]: true } } } };
    }
    case "meeting.scheduled": {
      const m = s.meetings[e.meetingId] ?? { meetingId: e.meetingId, matchId: e.matchId, askId: e.askId, slot: e.slot, approved: {} };
      return { ...s, meetings: { ...s.meetings, [e.meetingId]: { ...m, status: "scheduled" } as Meeting } };
    }
    case "meeting.asked": {
      const m = s.meetings[e.meetingId]; if (!m) return s;
      return { ...s, meetings: { ...s.meetings, [e.meetingId]: { ...m, status: "asked" } } };
    }
    case "meeting.confirmed": {
      const m = s.meetings[e.meetingId]; if (!m) return s;
      return { ...s, meetings: { ...s.meetings, [e.meetingId]: { ...m, status: "confirmed", happened: e.happened } } };
    }
    default: return s;
  }
}

/** What an edge on the map should look like for a conversation. */
export function edgeState(c: Conv, matches: Match[]): "talking" | "fit" | "nofit" | "revealed" {
  if (matches.some((m) => m.convId === c.convId && m.status === "revealed")) return "revealed";
  if (!c.verdict) return "talking";
  return c.verdict.willing && c.verdict.fit >= 7 ? "fit" : "nofit";
}

export const KIND_LABEL: Record<string, string> = { study: "Study help", teammate: "Teammate", coffee: "Coffee chat", cofounder: "Cofounder", advice: "Advice" };
export const TOPIC_LABEL: Record<string, string> = {
  classes: "Classes", grades: "Grades", internships: "Internships", projects: "Projects", availability: "Availability", startup: "Startup plans", contact: "Contact details",
};
