// Sample content: fictional people and bots for the UI demo. Nothing here is a real person.
export type Bot = {
  id: string;
  name: string; // the person the bot speaks for
  where: string;
  status: "talking" | "wandering";
  talkWith?: string;
  lines?: string[];
  at?: [number, number]; // grid metres on the campus map
};

export const BOTS: Bot[] = [
  { id: "priya", name: "Priya Raman", where: "Main Quad", status: "talking", talkWith: "dev", at: [165, 262],
    lines: ["You both built soft grippers?", "Dev wants a hackathon teammate.", "Same lab, different floors!"] },
  { id: "dev", name: "Dev Okafor", where: "Main Quad", status: "talking", talkWith: "priya", at: [165, 262] },
  { id: "lena", name: "Lena Fischer", where: "Hoover Tower", status: "talking", talkWith: "marcus", at: [398, 192],
    lines: ["Marcus is raising a seed round.", "Lena ran growth at a climate startup.", "Coffee at Tresidder?"] },
  { id: "marcus", name: "Marcus Chen", where: "Hoover Tower", status: "talking", talkWith: "lena", at: [398, 192] },
  { id: "aiko", name: "Aiko Tanaka", where: "Memorial Court", status: "wandering", at: [205, 175] },
  { id: "sam", name: "Sam Rivera", where: "Lomita Mall", status: "wandering", at: [300, 210] },
  { id: "noor", name: "Noor Haddad", where: "Green Library", status: "wandering", at: [455, 240] },
  { id: "jonah", name: "Jonah Brooks", where: "The Oval", status: "wandering", at: [118, 120] },
  { id: "ines", name: "Inés Morales", where: "Meyer Green", status: "wandering", at: [350, 120] },
  { id: "tariq", name: "Tariq Aziz", where: "Main Quad", status: "wandering", at: [240, 330] },
];

export const MATCHES = [
  { id: "m1", name: "Priya + Dev · robotics", score: 91 },
  { id: "m2", name: "Lena + Marcus · climate", score: 84 },
  { id: "m3", name: "Aiko + Noor · design", score: 77 },
  { id: "m4", name: "Sam + Jonah · running club", score: 62 },
  { id: "m5", name: "Inés + Tariq · bio ML", score: 58 },
];

export const PROFILE = [
  { id: "f1", text: "CS master's student at Stanford", source: "linkedin.com" },
  { id: "f2", text: "Previously ML intern at a robotics startup", source: "linkedin.com" },
  { id: "f3", text: "Organised TreeHacks 2026", source: "x.com" },
  { id: "f4", text: "Posts about soft robotics and climbing", source: "x.com" },
];

export const CALL_SCRIPT: { who: "grok" | "you"; text: string; fact?: string }[] = [
  { who: "grok", text: "Hi! I'm Grok, an AI calling for Mixer. Got two minutes to help me build your bot?" },
  { who: "you", text: "Sure, go for it." },
  { who: "grok", text: "Your profile says soft robotics. What are you working on right now?" },
  { who: "you", text: "A gripper that can pick strawberries without bruising them." },
  { who: "grok", text: "Love that. Who would you most want to meet this quarter?", fact: "Building a soft gripper for fruit picking" },
  { who: "you", text: "Someone who does controls, and maybe a co-founder." },
  { who: "grok", text: "Got it. Anything your bot should never share?", fact: "Wants: a controls engineer, a co-founder" },
  { who: "you", text: "Don't mention my startup idea by name." },
  { who: "grok", text: "Noted. Your bot will keep that private. Building it now!", fact: "Never shares: the startup's name" },
];
