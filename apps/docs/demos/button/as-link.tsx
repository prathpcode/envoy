import Link from "next/link";
import { Button } from "@pixel3d/ui";

export default function ButtonAsLink() {
  return (
    <Button asChild size="lg">
      <Link href="/docs/installation">Read the install guide</Link>
    </Button>
  );
}
