import { Checkbox, Label, Switch } from "@pixel3d/ui";

export default function LabelBasic() {
  return (
    <div className="flex flex-col gap-6">
      <Label>
        <Checkbox defaultChecked />
        Bring a laptop charger
      </Label>
      <div className="flex items-center gap-3">
        <Switch id="label-demo-remote" />
        <Label htmlFor="label-demo-remote">Hacking remotely</Label>
      </div>
    </div>
  );
}
