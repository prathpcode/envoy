import { Alert, AlertDescription, AlertTitle } from "@pixel3d/ui";

export default function AlertVariants() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Alert>
        <AlertTitle>Wi-Fi password is on the whiteboard</AlertTitle>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Mentors are in room B until midnight</AlertTitle>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Project submitted</AlertTitle>
        <AlertDescription>Judges see it from 09:00.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Submissions close in 30 minutes</AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Demo link is broken</AlertTitle>
        <AlertDescription>Check the URL is public, then resubmit.</AlertDescription>
      </Alert>
    </div>
  );
}
