"use client";
import * as React from "react";
import { Checkbox, Label } from "@pixel3d/ui";

export default function CheckboxBasic() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(true);
  return (
    <div className="flex flex-col gap-6">
      <Label>
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        I agree to the code of conduct
      </Label>
      <Label>
        <Checkbox />
        Find me a team
      </Label>
      <Label>
        <Checkbox checked="indeterminate" />
        Some tracks selected
      </Label>
      <Label>
        <Checkbox disabled />
        Hardware track (full)
      </Label>
    </div>
  );
}
