import { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS_AND_CHARS } from "@pixel3d/ui";

export default function InputOTPInvite() {
  return (
    <InputOTP
      maxLength={4}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      defaultValue="NP"
      aria-label="Team invite code"
      inputMode="text"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}
