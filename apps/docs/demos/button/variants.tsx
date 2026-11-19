import { Button } from "@pixel3d/ui";

export default function ButtonVariants() {
  return (
    <>
      <Button>Ship it</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="success">Merge</Button>
      <Button variant="destructive">Delete team</Button>
      <Button variant="ink">Join Discord</Button>
      <Button variant="ghost">Skip</Button>
    </>
  );
}
