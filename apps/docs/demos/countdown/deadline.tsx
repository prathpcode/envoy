"use client";
import * as React from "react";
import { Countdown } from "@pixel3d/ui";

export default function CountdownDeadline() {
  // Submissions close 36 hours from now.
  const [deadline] = React.useState(() => Date.now() + 36 * 60 * 60 * 1000);
  return <Countdown to={deadline} />;
}
