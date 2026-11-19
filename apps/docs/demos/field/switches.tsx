import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet, Switch } from "@pixel3d/ui";

const prefs = [
  { id: "pref-judging", label: "Ping me when judging starts", on: true },
  { id: "pref-food", label: "Ping me when food lands", on: true },
  { id: "pref-stream", label: "Livestream our demo", on: false },
];

export default function FieldSwitches() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Notifications</FieldLegend>
      <FieldGroup>
        {prefs.map((p) => (
          <Field key={p.id} orientation="horizontal" className="justify-between">
            <FieldLabel htmlFor={p.id}>{p.label}</FieldLabel>
            <Switch id={p.id} defaultChecked={p.on} />
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
