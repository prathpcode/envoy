"use client";
import * as React from "react";
import { empty, reduce, edgeState, type EnvoyEvent, type State } from "./store";

export const RELAY =
  process.env.NEXT_PUBLIC_RELAY_URL ?? (typeof window === "undefined" ? "http://localhost:8787" : `http://${window.location.hostname}:8787`);

export type Row = { userId: string; name: string; points: number };
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
export function useEnvoy(as: string | null, frame: React.RefObject<HTMLIFrameElement | null>) {
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
      if (e.data?.type !== "envoy:ready") return;
      mapReady.current = true;
      for (const m of queue.current.splice(0)) frame.current?.contentWindow?.postMessage(m, "*");
    };
    addEventListener("message", onMsg);
    // the map usually finishes loading before this listener exists, so keep knocking until it answers
    const knock = setInterval(() => { if (mapReady.current) clearInterval(knock); else frame.current?.contentWindow?.postMessage({ type: "envoy:hello" }, "*"); }, 250);
    return () => { removeEventListener("message", onMsg); clearInterval(knock); };
  }, [frame]);

  const refreshBoard = React.useCallback(() => {
    if (as) api("/state", as).then((s: Snapshot) => setBoard(s.leaderboard ?? [])).catch(() => {});
  }, [as]);

  React.useEffect(() => {
    if (!as) return;
    const es = new EventSource(`${RELAY}/events?as=${encodeURIComponent(as)}`);
    es.onopen = () => {
      // a fresh connection replays from the start, so start from nothing
      live.current = empty(); setState(live.current); post({ type: "envoy:reset" }); setOnline(true); refreshBoard();
    };
    es.onerror = () => setOnline(false);
    es.onmessage = (msg) => {
      const e = JSON.parse(msg.data) as EnvoyEvent;
      const fresh = Date.now() - (typeof e.at === "number" ? e.at : Date.parse(e.at)) < 4000;
      const s = (live.current = reduce(live.current, e));
      setState(s);
      // mirror onto the map
      if (e.type === "node.joined") post({ type: "envoy:nodes", nodes: [{ ...e.user, me: e.user.id === as }] });
      if (e.type === "scout.picked") { const a = s.asks[e.askId]; post({ type: "envoy:ask", askId: e.askId, spot: a?.spot, mine: a?.mine, candidates: e.candidates, fly: fresh && (a?.mine || as === "spectator") }); }
      if (e.type === "conv.started" || e.type === "conv.verdict" || e.type === "match.revealed") {
        const c = s.convs[e.convId]; if (c) post({ type: "envoy:edge", convId: c.convId, askId: c.askId, alias: c.alias, state: edgeState(c, Object.values(s.matches)) });
      }
      if (fresh && (e.type === "conv.message" || e.type === "conv.withheld")) post({ type: "envoy:pulse", convId: e.convId, fromAsker: e.from === "Asker", withheld: e.type === "conv.withheld" });
      if (e.type === "match.revealed" && e.asker && e.offerer) post({ type: "envoy:link", a: e.asker.id, b: e.offerer.id });
      if (e.type === "karma.changed") { refreshBoard(); if (fresh && e.userId === as) setLastKarma({ delta: e.delta, at: Date.now() }); }
    };
    return () => { es.close(); setOnline(false); };
  }, [as, post, refreshBoard]);

  return { state, board, online, lastKarma, post, refreshBoard };
}
