"use client";
import * as React from "react";
import { empty, reduce, edgeState, type GrokmateEvent, type State } from "./store";

export const RELAY =
  process.env.NEXT_PUBLIC_RELAY_URL ?? (typeof window === "undefined" ? "http://localhost:8787" : `http://${window.location.hostname}:8787`);


export type Row ={ userId: string; name: string; points: number };
type Snapshot = { me?: { id: string; name: string } | null; leaderboard: Row[] };

export async function api(path: string, as: string, method = "GET", body?: unknown) {
  const r = await fetch(`${RELAY}${path}${path.includes("?") ? "&" : "?"}as=${encodeURIComponent(as)}`, {
    method, headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error ?? `Relay said ${r.status}`);
  return data;
}

/**
 * One connection to the relay as one viewer. Folds the stream into state and mirrors it onto the map
 * iframe. The relay replays its whole (redacted) log on every connect, so a refresh rebuilds everything.
 */
export function useGrokmate(as: string | null, frame: React.RefObject<HTMLIFrameElement | null>) {
  const [state, setState] = React.useState<State>(empty);
  const [board, setBoard] = React.useState<Row[]>([]);
  const [online, setOnline] = React.useState(false);
  const [lastKarma, setLastKarma] = React.useState<{ delta: number; at: number } | null>(null);
  const mapReady = React.useRef(false), queue = React.useRef<unknown[]>([]), live = React.useRef<State>(empty());

  const post = React.useCallback((msg: unknown) => {
    if (mapReady.current) frame.current?.contentWindow?.postMessage(msg, "*"); else queue.current.push(msg);
  }, [frame]);

  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== "grokmate:ready") return;
      mapReady.current = true;
      for (const m of queue.current.splice(0)) frame.current?.contentWindow?.postMessage(m, "*");
    };
    addEventListener("message", onMsg);
    // the map usually finishes loading before this listener exists, so keep knocking until it answers
    const knock = setInterval(() => { if (mapReady.current) clearInterval(knock); else frame.current?.contentWindow?.postMessage({ type: "grokmate:hello" }, "*"); }, 250);
    return () => { removeEventListener("message", onMsg); clearInterval(knock); };
  }, [frame]);

  const refreshBoard = React.useCallback(() => {
    if (as) api("/state", as).then((s: Snapshot) => setBoard(s.leaderboard ?? [])).catch(() => {});
  }, [as]);

  React.useEffect(() => {
    if (!as) return;
    const es = new EventSource(`${RELAY}/events?as=${encodeURIComponent(as)}`);
    const clears = new Set<ReturnType<typeof setTimeout>>();
    es.onopen = () => {
      for (const t of clears) clearTimeout(t); clears.clear();
      // a fresh connection replays from the start, so start from nothing
      live.current = empty(); setState(live.current); post({ type: "grokmate:reset" }); setOnline(true); refreshBoard();
    };
    es.onerror = () => setOnline(false);
    es.onmessage = (msg) => {
      const e = JSON.parse(msg.data) as GrokmateEvent;
      const fresh = Date.now() - (typeof e.at === "number" ? e.at : Date.parse(e.at)) < 4000;
      const s = (live.current = reduce(live.current, e));
      setState(s);
      // mirror onto the map
      if (e.type === "node.joined") post({ type: "grokmate:nodes", nodes: [{ ...e.user, me: e.user.id === as }] });
      if (e.type === "scout.picked") { const a = s.asks[e.askId]; post({ type: "grokmate:ask", askId: e.askId, spot: a?.spot, mine: a?.mine, candidates: e.candidates, fresh, fly: fresh && (a?.mine || as === "spectator") }); }
      if (e.type === "conv.started" || e.type === "conv.verdict" || e.type === "match.revealed") {
        const c = s.convs[e.convId]; if (c) post({ type: "grokmate:edge", convId: c.convId, askId: c.askId, alias: c.alias, state: edgeState(c, Object.values(s.matches)) });
      }
      if (fresh && (e.type === "conv.message" || e.type === "conv.withheld")) post({ type: "grokmate:pulse", convId: e.convId, fromAsker: e.from === "Asker", withheld: e.type === "conv.withheld" });
      if (e.type === "match.revealed" && e.asker && e.offerer) {
        post({ type: "grokmate:link", a: e.asker.id, b: e.offerer.id });
        // only the two parties get names, so only they see the envoys drop their masks
        post({ type: "grokmate:reveal", askId: e.askId, alias: e.alias, asker: e.asker.name, offerer: e.offerer.name, askerId: e.asker.id, offererId: e.offerer.id });
      }
      // the end of a round: the matched pair walks off together to where they will meet, everyone else heads home
      if (e.type === "match.revealed") {
        const c = s.convs[e.convId], mt = Object.values(s.meetings).find((x) => x.matchId === e.matchId);
        if (c) post({ type: "grokmate:matched", askId: c.askId, alias: c.alias, place: mt?.place?.key, fresh });
      }
      if (e.type === "meeting.proposed" && e.place) {
        const m = s.matches[e.matchId], c = m ? s.convs[m.convId] : undefined;
        if (c) post({ type: "grokmate:matched", askId: c.askId, alias: c.alias, place: e.place.key, fresh });
      }
      if (e.type === "ask.open") post({ type: "grokmate:clearAsk", askId: e.askId, fresh });
      if (e.type === "karma.changed") { refreshBoard(); if (fresh && e.userId === as) setLastKarma({ delta: e.delta, at: Date.now() }); }
    };
    return () => { es.close(); setOnline(false); for (const t of clears) clearTimeout(t); clears.clear(); };
  }, [as, post, refreshBoard]);

  return { state, board, online, lastKarma, post, refreshBoard };
}
