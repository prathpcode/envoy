"use client";
import * as React from "react";
import { Trophy, Contact, Sliders } from "pixelarticons/react";
import { Badge, Button, toast } from "@pixel3d/ui";
import { fireStickerBurst } from "@pixel3d/ui/three";
import { useEnvoy } from "@/lib/envoy/use-envoy";
import { AskPanel } from "./ask-panel";
import { TranscriptSheet } from "./transcript-sheet";
import { KarmaSheet, PersonSheet, DemoDesk } from "./sheets";

const tilt = (deg: number) => ({ ["--p3d-tilt" as string]: `${deg}deg` }) as React.CSSProperties;

/** The whole app: the campus is the ground, and everything else is a sticker on top of it. */
export function EnvoyApp() {
  const frame = React.useRef<HTMLIFrameElement>(null);
  const [as, setAs] = React.useState<string | null>(null);
  React.useEffect(() => { setAs(new URLSearchParams(window.location.search).get("as") ?? "u_you"); }, []);
  const { state, board, online, lastKarma, post, refreshBoard } = useEnvoy(as, frame);

  const [openConv, setOpenConv] = React.useState<string | null>(null);
  const [person, setPerson] = React.useState<string | null>(null);
  const [karmaOpen, setKarmaOpen] = React.useState(false);
  const [demoOpen, setDemoOpen] = React.useState(false);

  // taps on the map: an edge or an envoy opens its conversation, a person opens their card
  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "envoy:tapEdge") setOpenConv(e.data.convId);
      if (e.data?.type === "envoy:tapNode" && e.data.id) setPerson(e.data.id);
    };
    addEventListener("message", onMsg);
    return () => removeEventListener("message", onMsg);
  }, []);

  React.useEffect(() => {
    if (!lastKarma) return;
    if (lastKarma.delta > 0) toast.success(`+${lastKarma.delta} karma`); else toast.error(`${lastKarma.delta} karma`);
  }, [lastKarma]);

  // a reveal that involves me lands with a burst (but not while the log is replaying on load)
  const seen = React.useRef<Set<string> | null>(null);
  React.useEffect(() => {
    const mine = Object.values(state.matches).filter((m) => m.status === "revealed" && m.asker && m.offerer).map((m) => m.matchId);
    if (seen.current && mine.some((id) => !seen.current!.has(id))) fireStickerBurst(undefined, { count: 26 });
    if (online) seen.current = new Set(mine);
  }, [state.matches, online]);

  const spectator = as === "spectator";
  const people = Object.keys(state.users).length;
  const myPoints = board.find((r) => r.userId === as)?.points;

  return (
    <main className="relative h-dvh overflow-hidden">
      <iframe ref={frame} src="/map/iso.html?embed=1&s=0.62&lat=37.4268&lon=-122.1690&ox=480" title="The Stanford campus with everyone's bots on it" className="map-frame" />

      <div className="hud pointer-events-none absolute inset-0">
        <section className="absolute left-4 top-6 flex max-h-[calc(100dvh-3rem)] w-[calc(100%-2rem)] max-w-[460px] flex-col md:left-8 md:top-8">
          <span className="sticker face-ink crooked relative z-10 -mb-5 ml-6 self-start px-5 py-2 text-xl font-extrabold tracking-tight" style={tilt(-2.5)}>
            Envoy
          </span>
          {as && <AskPanel as={as} state={state} online={online} onOpenConv={setOpenConv} onFocusAsk={(askId) => post({ type: "envoy:focus", askId })} />}
        </section>

        <nav className="absolute right-4 top-6 flex flex-wrap items-center justify-end gap-4 md:right-8 md:top-8" aria-label="Network">
          <Badge tone="paper" tilt={2}>{people} on campus</Badge>
          <Button variant="secondary" tilt={-1.5} onClick={() => { refreshBoard(); setKarmaOpen(true); }}>
            <Trophy /> Karma{myPoints !== undefined ? ` · ${myPoints}` : ""}
          </Button>
          {!spectator && as && <Button variant="secondary" tilt={1.5} onClick={() => setPerson(as)}><Contact /> My card</Button>}
          <Button variant="ink" size="icon" aria-label="Demo desk" onClick={() => setDemoOpen(true)}><Sliders /></Button>
        </nav>
      </div>

      <TranscriptSheet conv={openConv ? state.convs[openConv] : undefined} ask={openConv ? state.asks[state.convs[openConv]?.askId] : undefined} onClose={() => setOpenConv(null)} />
      <KarmaSheet open={karmaOpen} onOpenChange={setKarmaOpen} board={board} me={as} />
      {as && <PersonSheet as={as} userId={person} user={person ? state.users[person] : undefined} points={board.find((r) => r.userId === person)?.points}
        known={Object.values(state.matches).some((m) => m.status === "revealed" && (m.asker?.id === person || m.offerer?.id === person) && person !== as)}
        onClose={() => setPerson(null)} />}
      {as && <DemoDesk open={demoOpen} onOpenChange={setDemoOpen} as={as} users={Object.values(state.users)} />}
    </main>
  );
}
