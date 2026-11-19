import { Label, RadioGroup, RadioGroupItem } from "@pixel3d/ui";

export default function RadioGroupBasic() {
  return (
    <RadioGroup defaultValue="in-person" aria-label="How are you joining?">
      <Label>
        <RadioGroupItem value="in-person" />
        In person
      </Label>
      <Label>
        <RadioGroupItem value="remote" />
        Remote
      </Label>
      <Label>
        <RadioGroupItem value="judge" />
        Just judging
      </Label>
      <Label>
        <RadioGroupItem value="mentor" disabled />
        Mentoring (slots full)
      </Label>
    </RadioGroup>
  );
}
