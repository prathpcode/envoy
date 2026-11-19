"use client";
import * as React from "react";
import { Leaderboard, PixelAvatar, type LeaderboardEntry } from "@pixel3d/ui";

const TEAMS = ["Null Pointers", "Byte Club", "Merge Conflict", "Ctrl Alt Elite", "Stack Smashers", "404 Sleep Not Found"];

const start: LeaderboardEntry[] = TEAMS.map((name, i) => ({
  id: name,
  name,
  score: 900 - i * 110,
  avatar: <PixelAvatar name={name} size="sm" tilt={false} />,
}));

export default function LeaderboardLive() {
  const [entries, setEntries] = React.useState(start);
  React.useEffect(() => {
    // judges keep scoring: every 2s each team gains a few points
    const id = window.setInterval(() => {
      setEntries((list) => list.map((e) => ({ ...e, score: e.score + Math.round(Math.random() * 180) })));
    }, 2000);
    return () => window.clearInterval(id);
  }, []);
  return <Leaderboard entries={entries} className="max-w-2xl" aria-label="Live scores" />;
}
