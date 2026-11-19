import { Stepper } from "@pixel3d/ui";

export default function StepperVertical() {
  return (
    <div className="w-full max-w-xs">
      <Stepper
        orientation="vertical"
        current={2}
        aria-label="Hackathon schedule"
        steps={["Kickoff", "Team up", "Build", "Demos", "Awards"]}
      />
    </div>
  );
}
