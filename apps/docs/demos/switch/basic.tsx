import { Label, Switch } from "@pixel3d/ui";

export default function SwitchBasic() {
  return (
    <div className="flex flex-col gap-6">
      <Label>
        <Switch defaultChecked />
        Find me a team
      </Label>
      <Label>
        <Switch />
        Livestream my demo
      </Label>
      <Label>
        <Switch disabled />
        Hardware lab access (sold out)
      </Label>
    </div>
  );
}
