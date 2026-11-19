import type { ComponentDoc } from "@/lib/types";
import Registration from "@/demos/field/registration";
import Switches from "@/demos/field/switches";

export const doc: ComponentDoc = {
  slug: "field",
  name: "Field",
  category: "Forms",
  summary: "Layout parts for composing forms: groups, fieldsets, labels and problem-plus-fix error stickers.",
  files: ["components/field.tsx", "components/label.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority", "pixelarticons"],
  registryDependencies: ["label"],
  demos: [
    { id: "registration", title: "Team registration", Component: Registration, height: 860 },
    { id: "switches", title: "Switch list", Component: Switches, height: 360 },
  ],
  usage: `
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

<FieldSet>
  <FieldLegend>Register your team</FieldLegend>
  <FieldGroup>
    <Input label="Team name" />
    <Field orientation="horizontal" invalid={!agreed}>
      <Checkbox id="coc" />
      <FieldLabel htmlFor="coc">I agree to the code of conduct</FieldLabel>
      <FieldError>Tick the box to agree before you register</FieldError>
    </Field>
  </FieldGroup>
</FieldSet>
`,
  props: [
    {
      component: "Field",
      rows: [
        { name: "orientation", type: '"vertical" | "horizontal" | "responsive"', default: '"vertical"', description: "Horizontal puts a Switch, Checkbox or radio beside its label." },
        { name: "invalid", type: "boolean", description: "Sets data-invalid for styling the label." },
      ],
    },
    {
      component: "FieldError",
      rows: [
        { name: "children", type: "ReactNode", description: "The message: name the problem and the fix." },
        { name: "errors", type: "{ message?: string }[]", description: "From a form library; shows the first message. Renders nothing when empty." },
      ],
    },
    {
      component: "FieldLegend",
      rows: [{ name: "variant", type: '"legend" | "label"', default: '"legend"', description: "A section heading, or a label-sized title for a radio set." }],
    },
  ],
  a11y: [
    "FieldSet and FieldLegend are a real <fieldset> and <legend>, so groups are announced by name.",
    "FieldError has role=alert, so it's read out when it appears.",
    "Name-tag fields (Input, Textarea, Select) carry their own label; don't add a FieldLabel to them.",
  ],
  do: [
    "Use Field + FieldLabel for Switch, Checkbox and RadioGroup items.",
    "Write errors as problem + fix: “Pick a track to get a judging slot”.",
    "Show errors after submit, not while someone is still typing.",
  ],
  dont: [
    "Don't add FieldDescription to every field; only where it prevents an error.",
    "Don't nest FieldSets more than one level deep.",
  ],
};
