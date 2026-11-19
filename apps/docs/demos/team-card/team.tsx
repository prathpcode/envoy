import { Button, TeamCard } from "@pixel3d/ui";

export default function TeamCardDemo() {
  return (
    <>
      <TeamCard
        name="Null Pointers"
        track="AI tools"
        members={["Ada", "Linus", "Grace"]}
        action={<Button size="sm">Join team</Button>}
      />
      <TeamCard
        name="Merge Conflict"
        track="Climate"
        trackTone="lime"
        members={["Kai", "Noor", "Mateo", "Yuki", "Ines", "Tariq"]}
        action={
          <Button size="sm" variant="secondary">
            View project
          </Button>
        }
      />
    </>
  );
}
