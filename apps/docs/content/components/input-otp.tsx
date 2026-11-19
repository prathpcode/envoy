import type { ComponentDoc } from "@/lib/types";
import CheckIn from "@/demos/input-otp/check-in";
import Invite from "@/demos/input-otp/invite";

export const doc: ComponentDoc = {
  slug: "input-otp",
  name: "Input OTP",
  category: "Forms",
  summary: "One square sticker per character; the active one cuts sky with a pink caret and each digit slaps in.",
  files: ["components/input-otp.tsx", "styles/forms.css", "lib/utils.ts"],
  dependencies: ["input-otp", "pixelarticons"],
  demos: [
    { id: "check-in", title: "6-digit check-in code", Component: CheckIn, height: 260 },
    { id: "invite", title: "Letters & digits", Component: Invite, height: 220 },
  ],
  usage: `
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
  <InputOTPGroup>
    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
`,
  props: [
    {
      component: "InputOTP",
      rows: [
        { name: "maxLength", type: "number", description: "Required. How many slots." },
        { name: "pattern", type: "string", description: "Allowed characters, e.g. REGEXP_ONLY_DIGITS (re-exported here too)." },
        { name: "value / onChange", type: "string / (value: string) => void", description: "Controlled code." },
        { name: "onComplete", type: "(value: string) => void", description: "Fires when the last slot fills." },
        { name: "containerClassName", type: "string", description: "Classes for the row of slots." },
      ],
    },
    {
      component: "InputOTPSlot",
      rows: [{ name: "index", type: "number", description: "Required. Which character this slot shows." }],
    },
  ],
  a11y: [
    "One real <input> underneath, so paste, autofill (one-time-code) and screen readers just work.",
    "Give it an aria-label like “Check-in code”.",
    "The active slot shows a sky kiss-cut and a pink caret.",
  ],
  do: ["Split six digits into two groups of three.", "Submit on onComplete instead of making people press a button."],
  dont: ["Don't use it for passwords.", "Don't go past eight slots."],
};
