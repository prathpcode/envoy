"use client";
import * as React from "react";
import {
  Button,
  Checkbox,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@pixel3d/ui";

export default function FieldRegistration() {
  const id = React.useId();
  const [submitted, setSubmitted] = React.useState(false);
  const [team, setTeam] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const show = (bad: boolean) => submitted && bad;

  return (
    <form
      className="w-full max-w-lg"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <FieldSet>
        <FieldLegend>Register your team</FieldLegend>
        <FieldGroup>
          <Input
            label="Team name"
            placeholder="Null Pointers"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            error={show(!team.trim()) ? "Add a team name so judges can find you" : undefined}
          />
          <Select value={track} onValueChange={setTrack}>
            <SelectTrigger label="Track" error={show(!track) ? "Pick a track to get a judging slot" : undefined}>
              <SelectValue placeholder="Pick a track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">AI agents</SelectItem>
              <SelectItem value="climate">Climate tech</SelectItem>
              <SelectItem value="games">Games</SelectItem>
            </SelectContent>
          </Select>

          <FieldSet>
            <FieldLegend variant="label">How are you joining?</FieldLegend>
            <RadioGroup defaultValue="in-person">
              <Field orientation="horizontal">
                <RadioGroupItem value="in-person" id={id + "-in"} />
                <FieldLabel htmlFor={id + "-in"}>In person</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="remote" id={id + "-remote"} />
                <FieldLabel htmlFor={id + "-remote"}>Remote</FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Switch id={id + "-mentor"} />
            <FieldLabel htmlFor={id + "-mentor"}>Find us a mentor</FieldLabel>
          </Field>

          <Field orientation="horizontal" invalid={show(!agreed)}>
            <Checkbox id={id + "-coc"} checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
            <FieldLabel htmlFor={id + "-coc"}>I agree to the code of conduct</FieldLabel>
            {show(!agreed) && <FieldError>Tick the box to agree before you register</FieldError>}
          </Field>

          <div>
            <Button type="submit">Register team</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
