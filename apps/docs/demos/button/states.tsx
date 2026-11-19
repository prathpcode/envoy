"use client";
import * as React from "react";
import { Button } from "@pixel3d/ui";

export default function ButtonStates() {
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1800);
        }}
      >
        {loading ? "Deploying" : "Deploy"}
      </Button>
      <Button disabled>Submissions closed</Button>
      <Button tilt={false} variant="secondary">
        Straight
      </Button>
      <Button tilt={-6} variant="success">
        Extra crooked
      </Button>
    </>
  );
}
