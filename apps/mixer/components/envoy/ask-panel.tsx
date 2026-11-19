"use client";
import * as React from "react";
import { Lock, Calendar } from "pixelarticons/react";
import { Badge, Button, Card, Stepper, Textarea, toast } from "@pixel3d/ui";
import { CharAvatar } from "@/components/char-avatar";
import { api, RELAY } from "@/lib/envoy/use-envoy";
import { KIND_LABEL, type Ask, type Conv, type Match, type Meeting, type State } from "@/lib/envoy/store";

const QUICK = [
  "Find me an iOS teammate for this weekend's hackathon",
  "I need a study partner for Thursday's linear algebra exam",
  "Who has interned at a robotics startup and will talk to me about it?",
];
const when = (iso: string) => new Date(iso).toLocaleString(undefined, { weekday: "long", hour: "numeric", minute: "2-digit" });
const call = (p: Promise<unknown>) => p.catch((e: Error) => toast.error(e.message));

/** The one card on the map: ask, watch your bot work, approve, meet. What it shows depends on who is looking. */
export function AskPanel({ as, state, online, onOpenConv, onFocusAsk }: {
  as: string; state: State; online: boolean; onOpenConv: (id: string) => void; onFocusAsk: (askId: string) => void;
}) {
  const spectator = as === "spectator";
  const asks = state.askOrder.map((id) => state.asks[id]).filter(Boolean);
  const convsOf = (a: Ask) => a.convIds.map((id) => state.convs[id]).filter(Boolean);
  const mine = [...asks].reverse().find((a) => a.mine);
  const incoming = [...asks].reverse().find((a) => !a.mine && convsOf(a).some((c) => c.you));
  const [composing, setComposing] = React.useState(false);
  const [text, setText] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const send = async (t: string) => {
    if (!t.trim()) return;
    setSending(true);
    try { await api("/asks", as, "POST", { text: t.trim() }); setText(""); setComposing(false); }
    catch (e) { toast.error((e as Error).message); }
    setSending(false);
  };

  if (!online) {
    return (
      <Card className="flex flex-col gap-3 px-6 pb-6 pt-9">
        <h1 className="text-3xl font-extrabold leading-tight text-ink">Waiting for the relay</h1>
        <p className="text-base font-medium text-ink-soft">Start it with <code className="font-mono">node server.mjs</code> in <code className="font-mono">apps/relay</code>. This page connects by itself.</p>
      </Card>
    );
  }

  if (spectator) {
    const live = [...asks].reverse().find((a) => a.status === "talking" || a.status === "matching") ?? asks[asks.length - 1];
    return (
      <Card className="flex flex-col gap-4 min-h-0 overflow-y-auto px-6 pb-6 pt-9">
        <h1 className="text-3xl font-extrabold leading-tight text-ink">The campus, from the outside</h1>
        <p className="text-base font-medium text-ink-soft">You see bots talk. You never see who they speak for.</p>
        {live ? <Round ask={live} convs={convsOf(live)} title={`${KIND_LABEL[live.kind] ?? "An"} ask`} onOpenConv={onOpenConv} onFocus={() => onFocusAsk(live.askId)} />
          : <p className="text-base font-bold text-ink">No asks yet.</p>}
      </Card>
    );
  }

  const active = !composing ? mine ?? incoming : undefined;
  if (!active) {
    return (
      <Card className="flex flex-col gap-5 min-h-0 overflow-y-auto px-6 pb-7 pt-10">
        <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight text-ink">Your bot asks the campus so you don&apos;t have to.</h1>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); send(text); }}>
          <Textarea label="What do you need?" rows={2} autoGrow placeholder="A study partner for Thursday's exam" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex flex-col items-start gap-3">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => setText(q)} className="cursor-pointer text-left text-base font-bold text-ink underline decoration-2 underline-offset-4 hover:decoration-pink">{q}</button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" tilt={-2} loading={sending} disabled={!text.trim()}>Send my bot</Button>
            {mine && <Button type="button" variant="ghost" onClick={() => setComposing(false)}>Back</Button>}
          </div>
        </form>
      </Card>
    );
  }

  const asker = active.mine;
  const convs = convsOf(active);
  const matches = Object.values(state.matches).filter((m) => m.askId === active.askId).sort((a, b) => a.rank - b.rank);
  const meetings = Object.values(state.meetings).filter((m) => m.askId === active.askId);
  const revealed = matches.filter((m) => m.status === "revealed");
  const pending = matches.find((m) => m.status === "proposed");
  const step = revealed.length ? (meetings.some((m) => m.status !== "proposed") ? 4 : 3) : active.status === "matching" || active.status === "open" ? 2 : active.status === "talking" ? 1 : 0;

  return (
    <Card className="flex flex-col gap-5 min-h-0 overflow-y-auto px-6 pb-6 pt-10">
      <div className="flex flex-col gap-2">
        <Badge tone="sky" tilt={-2} className="self-start">{asker ? "Your ask" : "A bot is asking yours"} · {KIND_LABEL[active.kind] ?? active.kind}</Badge>
        {active.text && <p className="text-xl font-extrabold leading-snug text-ink">{active.text}</p>}
      </div>
      <Stepper steps={["Scout", "Talk", "Match", "Meet"]} current={step} />

      {!revealed.length && <Round ask={active} convs={asker ? convs : convs.filter((c) => c.you)} onOpenConv={onOpenConv} onFocus={() => onFocusAsk(active.askId)} />}

      {pending && <Proposal as={as} match={pending} asker={asker} mineToAnswer={(asker && pending.awaiting === "asker") || (!asker && pending.awaiting === "offerer")} />}
      {active.status === "open" && !pending && (
        <p className="text-base font-bold text-ink">Nobody cleared the bar this round. Your ask stays open and gets re-scored whenever someone joins.</p>
      )}

      {revealed.map((m) => {
        const other = asker ? m.offerer : m.asker, meeting = meetings.find((x) => x.matchId === m.matchId);
        return (
          <div key={m.matchId} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {other && <CharAvatar name={other.name} cell={4} walk />}
              <div className="flex min-w-0 flex-col gap-1">
                <Badge tone="lime" tilt={2} className="self-start">Revealed</Badge>
                <span className="text-2xl font-extrabold leading-tight text-ink">{other ? `Meet ${other.name}` : "Both said yes"}</span>
              </div>
            </div>
            <BriefLines match={m} />
            {meeting && <MeetingRow as={as} meeting={meeting} role={asker ? "asker" : "offerer"} />}
          </div>
        );
      })}

      {asker && (active.status === "filled" || active.status === "open") && (
        <Button variant="secondary" className="self-start" onClick={() => setComposing(true)}>Ask something else</Button>
      )}
    </Card>
  );
}

function fitBlocks(fit: number) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => <span key={i} className={`h-4 w-2 ${i < fit ? "bg-ink" : "bg-disabled-face"}`} />)}
    </span>
  );
}

/** The five conversations of a round. Aliases only: a letter is all the relay hands out. */
function Round({ ask, convs, title, onOpenConv, onFocus }: { ask: Ask; convs: Conv[]; title?: string; onOpenConv: (id: string) => void; onFocus: () => void }) {
  if (!convs.length) return <p className="text-base font-bold text-ink">Scouting every card on campus for the best five…</p>;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-base font-extrabold text-ink">{title ?? (convs.length > 1 ? `${convs.length} bots, talking anonymously` : "Your bot's conversation")}</span>
        <Button variant="ghost" size="sm" className="text-ink" onClick={onFocus}>Show on map</Button>
      </div>
      <ul className="flex flex-col gap-2">
        {convs.map((c) => {
          const v = c.verdict, held = c.lines.filter((l) => l.withheld).length;
          return (
            <li key={c.convId}>
              <button type="button" onClick={() => onOpenConv(c.convId)} className="sticker sticker-flat face-paper flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left">
                <span className={`flex size-9 shrink-0 items-center justify-center text-lg font-extrabold ${v ? (v.willing && v.fit >= 7 ? "bg-lime text-ink" : "bg-disabled-face text-ink-soft") : "bg-sky text-ink"}`}>{c.you ? "You" : c.alias}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-base font-bold text-ink">
                    {!c.started ? "Waiting to start" : !v ? "Talking…" : v.willing ? v.fitReason : v.willingReason}
                  </span>
                  {held > 0 && <span className="flex items-center gap-1 text-sm font-bold text-ink-soft"><Lock className="pixel-icon size-4" /> {held} withheld</span>}
                </span>
                {v && <span className="flex shrink-0 items-center gap-2 text-base font-extrabold tabular-nums text-ink">{fitBlocks(v.fit)} {v.fit}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BriefLines({ match }: { match: Match }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-medium leading-snug text-ink">{match.brief?.why}</p>
      {!!match.brief?.talkAbout?.length && (
        <div className="flex flex-wrap gap-2 pt-1">{match.brief.talkAbout.map((t, i) => <Badge key={t} tone="paper" tilt={i % 2 ? 1.5 : -1.5}>{t}</Badge>)}</div>
      )}
    </div>
  );
}

/** The anonymous brief. The asker never picks among candidates: they say yes or no to the bot's pick. */
function Proposal({ as, match, asker, mineToAnswer }: { as: string; match: Match; asker: boolean; mineToAnswer: boolean }) {
  return (
    <div className="flex flex-col gap-3 border-t-4 border-dotted border-ink/20 pt-4">
      <span className="text-xl font-extrabold text-ink">{asker ? `Your bot picked ${match.alias}` : "You look like a fit"}</span>
      <BriefLines match={match} />
      {mineToAnswer ? (
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Button tilt={-2} onClick={() => call(api(`/matches/${match.matchId}/approve`, as, "POST"))}>{asker ? "Yes, ask them" : "Yes, reveal me"}</Button>
          <Button variant="ghost" className="text-ink" onClick={() => call(api(`/matches/${match.matchId}/decline`, as, "POST"))}>{asker ? "Pass" : "Not this time"}</Button>
          <span className="basis-full text-sm font-bold text-ink-soft">Names stay hidden until both of you say yes. Saying no costs nothing.</span>
        </div>
      ) : (
        <p className="text-base font-bold text-ink-soft">{asker ? `Waiting for ${match.alias} to say yes. If they don't, the next match moves up.` : "Waiting for the asker."}</p>
      )}
    </div>
  );
}

function MeetingRow({ as, meeting, role }: { as: string; meeting: Meeting; role: "asker" | "offerer" }) {
  const [helpful, setHelpful] = React.useState(true);
  const confirm = (happened: boolean) => call(api(`/meetings/${meeting.meetingId}/confirm`, as, "POST", { happened, helpful: role === "asker" ? happened && helpful : undefined }));
  return (
    <div className="flex flex-col gap-3 border-t-4 border-dotted border-ink/20 pt-4">
      <span className="flex items-center gap-2 text-xl font-extrabold text-ink"><Calendar className="pixel-icon size-6" /> {when(meeting.slot)}</span>
      {meeting.status === "proposed" && (meeting.approved[role]
        ? <p className="text-base font-bold text-ink-soft">You&apos;re in. Waiting for them to approve the time.</p>
        : <div className="flex flex-col items-start gap-2">
            <p className="text-base font-medium text-ink">Both bots compared calendars. This is the first slot you&apos;re both free.</p>
            <Button tilt={-2} onClick={() => call(api(`/meetings/${meeting.meetingId}/approve`, as, "POST"))}>Approve the time</Button>
          </div>)}
      {meeting.status === "scheduled" && (
        <div className="flex flex-wrap items-center gap-4">
          <Badge tone="lime" tilt={-2}>Invite sent</Badge>
          <Button variant="secondary" asChild><a href={`${RELAY}/meetings/${meeting.meetingId}/invite.ics?as=${encodeURIComponent(as)}`}>Add to calendar</a></Button>
        </div>
      )}
      {meeting.status === "asked" && (
        <div className="flex flex-col gap-3">
          <span className="text-base font-extrabold text-ink">Your bot is checking in: did you two meet?</span>
          {role === "asker" && (
            <label className="flex cursor-pointer items-center gap-3 text-base font-medium text-ink">
              <input type="checkbox" className="size-5 accent-[#141414]" checked={helpful} onChange={(e) => setHelpful(e.target.checked)} /> It helped
            </label>
          )}
          <div className="flex gap-4">
            <Button variant="success" onClick={() => confirm(true)}>We met</Button>
            <Button variant="ghost" className="text-ink" onClick={() => confirm(false)}>It didn&apos;t happen</Button>
          </div>
        </div>
      )}
      {meeting.status === "confirmed" && <p className="text-base font-bold text-ink-soft">{meeting.happened ? "Logged. Karma lands once you've both confirmed." : "Logged as not happened."}</p>}
    </div>
  );
}
