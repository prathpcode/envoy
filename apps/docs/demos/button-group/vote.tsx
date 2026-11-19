"use client";
import * as React from "react";
import { ThumbsDown, ThumbsUp } from "pixelarticons/react";
import { Button, ButtonGroup, ButtonGroupText } from "@pixel3d/ui";

export default function ButtonGroupVote() {
  const [votes, setVotes] = React.useState(128);
  return (
    <ButtonGroup aria-label="Vote for Voxel Pets">
      <Button variant="secondary" aria-label="Upvote" onClick={() => setVotes((v) => v + 1)}>
        <ThumbsUp />
      </Button>
      <ButtonGroupText aria-live="polite">{votes}</ButtonGroupText>
      <Button variant="secondary" aria-label="Downvote" onClick={() => setVotes((v) => v - 1)}>
        <ThumbsDown />
      </Button>
    </ButtonGroup>
  );
}
