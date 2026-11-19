"use client";
import * as React from "react";
import {
  Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Leaderboard,
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Switch, ToggleGroup, ToggleGroupItem, toast,
} from "@pixel3d/ui";
import { CharAvatar } from "@/components/char-avatar";
import { api, type Row } from "@/lib/grokmate/use-grokmate";
import { KIND_LABEL, TOPIC_LABEL, type User } from "@/lib/grokmate/store";

const fail = (e: Error) => toast.error(e.message);

/** Points only. The board never says what anyone asked for or helped with. */
export function KarmaSheet({ open, onOpenChange, board, me }: { open: boolean; onOpenChange: (o: boolean) => void; board: Row[]; me: string | null }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-lg">
        <SheetHeader>
          <SheetTitle>Karma</SheetTitle>
          <SheetDescription>Points come from meetings that happened. Nobody sees who asked for what.</SheetDescription>
        </SheetHeader>
        <Leaderboard blocks={10} entries={board.slice(0, 12).map((r) => ({ id: r.userId, name: r.userId === me ? `${r.name} (you)` : r.name, score: r.points, avatar: <CharAvatar name={r.name} cell={2} /> }))} />
      </SheetContent>
    </Sheet>
  );
}

type CardData = { card?: { offers: string[]; openTo: string[]; affiliation: string }; disclosure?: { rules: { topic: string; share: boolean }[] } };

/** A person's public card. Your own also shows the rules your bot follows, and you can change them here. */
export function PersonSheet({ as, userId, user, points, known, onClose }: {
  as: string; userId: string | null; user?: User; points?: number; known: boolean; onClose: () => void;
}) {
  const [data, setData] = React.useState<CardData | null>(null);
  const own = userId === as;
  React.useEffect(() => {
    setData(null);
    if (userId) api(`/card/${userId}`, as).then(setData).catch(fail);
  }, [userId, as]);
  const save = (patch: Record<string, unknown>) => api(`/card/${userId}`, as, "PUT", patch).then(() => api(`/card/${userId}`, as)).then(setData).catch(fail);
  const rules = data?.disclosure?.rules ?? [];

  return (
    <Sheet open={!!userId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="max-w-lg" bodyClassName="flex flex-col gap-6">
        <SheetHeader>
          <SheetTitle>{own ? "Your card" : user?.name ?? "Card"}</SheetTitle>
          <SheetDescription>{own ? "Offers only. Asks are never on a card." : data?.card?.affiliation ?? ""}</SheetDescription>
        </SheetHeader>

        {user && (
          <div className="flex items-center gap-5">
            <CharAvatar name={user.name} cell={5} walk turn />
            <div className="flex flex-col items-start gap-2">
              {points !== undefined && <Badge tone="paper" tilt={-2} className="tabular-nums">{points} karma</Badge>}
              {known && <Badge tone="lime" tilt={2}>In your world</Badge>}
              {own && data?.card && <span className="text-base font-medium text-on-lid-soft">{data.card.affiliation}</span>}
            </div>
          </div>
        )}

        {data?.card && (
          <>
            <div className="flex flex-col gap-3">
              <span className="text-lg font-extrabold text-on-lid">Can help with</span>
              <div className="flex flex-wrap gap-3">{data.card.offers.map((o, i) => <Badge key={o} tone="paper" tilt={i % 2 ? 1.5 : -1.5}>{o}</Badge>)}</div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-lg font-extrabold text-on-lid">Open to</span>
              {own ? (
                <ToggleGroup type="multiple" className="flex-wrap" value={data.card.openTo} onValueChange={(v: string[]) => save({ openTo: v })}>
                  {Object.entries(KIND_LABEL).map(([k, label]) => <ToggleGroupItem key={k} value={k}>{label}</ToggleGroupItem>)}
                </ToggleGroup>
              ) : (
                <div className="flex flex-wrap gap-3">{data.card.openTo.map((k, i) => <Badge key={k} tone="sky" tilt={i % 2 ? -1.5 : 1.5}>{KIND_LABEL[k] ?? k}</Badge>)}</div>
              )}
              {own && <span className="text-base font-medium text-on-lid-soft">The scout never routes an ask to you outside this list.</span>}
            </div>
          </>
        )}

        {own && rules.length > 0 && (
          <div className="flex flex-col gap-4">
            <span className="text-lg font-extrabold text-on-lid">Your bot may share</span>
            {rules.map((r) => (
              <label key={r.topic} className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-on-lid">
                {TOPIC_LABEL[r.topic] ?? r.topic}
                <Switch checked={r.share} onCheckedChange={(v: boolean) => save({ rules: rules.map((x) => (x.topic === r.topic ? { ...x, share: v } : x)) })} />
              </label>
            ))}
            <span className="text-base font-medium text-on-lid-soft">Anything switched off shows up as a grey &ldquo;withheld&rdquo; line in the transcript. The text never leaves your bot.</span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const NEWCOMERS = [
  { name: "Zoe Park", place: "roble", offers: ["iOS and SwiftUI", "CS 193P section leader", "App Store launches"], openTo: ["teammate", "study", "coffee"] },
  { name: "Mateo Alvarez", place: "flomo", offers: ["Math 51 tutor", "Linear algebra", "Problem-set groups"], openTo: ["study", "coffee"] },
  { name: "Hana Sato", place: "lagunita", offers: ["Robotics startup intern", "ROS and controls", "Hardware demos"], openTo: ["advice", "coffee", "cofounder"] },
];

/** Demo desk: change seats, skip waits, grow the network. Not part of the product. */
export function DemoDesk({ open, onOpenChange, as, users }: { open: boolean; onOpenChange: (o: boolean) => void; as: string; users: User[] }) {
  const go = (id: string) => { window.location.search = `?as=${encodeURIComponent(id)}`; };
  const next = React.useRef(0);
  const act = (p: Promise<unknown>, done: string) => p.then(() => toast.success(done)).catch(fail);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Demo desk</DialogTitle>
          <DialogDescription>Everyone except you is a sample persona. Open a second tab as one of them to tap their approvals yourself.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <span className="text-lg font-extrabold text-ink">Look through someone else&apos;s eyes</span>
          <div className="flex max-h-44 flex-wrap gap-3 overflow-y-auto p-1">
            <Button size="sm" variant={as === "spectator" ? "success" : "secondary"} onClick={() => go("spectator")}>Spectator</Button>
            {users.map((u) => <Button key={u.id} size="sm" variant={as === u.id ? "success" : "secondary"} onClick={() => go(u.id)}>{u.name}</Button>)}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-lg font-extrabold text-ink">Move time</span>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => act(api("/demo/clock", as, "POST", { advance: "timeout" }), "Approval timed out")}>Let an approval time out</Button>
            <Button variant="secondary" onClick={() => act(api("/demo/clock", as, "POST", { advance: "slot" }), "It's after the meeting")}>Jump past the meeting</Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => { const n = NEWCOMERS[next.current++ % NEWCOMERS.length]; act(api("/join", as, "POST", { ...n, invitedBy: as === "spectator" ? undefined : as }), `${n.name} joined`); }}>Someone new joins</Button>
          <Button variant="destructive" onClick={() => act(api("/demo/reset", as, "POST"), "Network reset").then(() => window.location.reload())}>Reset the network</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
