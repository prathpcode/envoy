"use client";
import { Button, Toaster, toast } from "@pixel3d/ui";

const id = "toast-types";

export default function ToastTypes() {
  return (
    <>
      <Toaster id={id} />
      <Button variant="secondary" onClick={() => toast("Judging starts in 30 minutes", { toasterId: id })}>
        Default
      </Button>
      <Button
        variant="success"
        onClick={() => toast.success("Project submitted", { description: "Pixel Pets is in the AI track.", toasterId: id })}
      >
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Repo link is private", { description: "Make it public so judges can see it.", toasterId: id })}
      >
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("Unsaved pitch notes", { toasterId: id })}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast.info("Pizza is on floor 2", { toasterId: id })}>
        Info
      </Button>
    </>
  );
}
