"use client";
import * as React from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@pixel3d/ui";

export default function InputOTPCheckIn() {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-bold text-on-lid">
        {code.length === 6 ? "You're checked in. Go find your table." : "Enter the check-in code on your badge"}
      </p>
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={setCode} aria-label="Check-in code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
