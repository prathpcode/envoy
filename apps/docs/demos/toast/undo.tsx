"use client";
import { Button, Toaster, toast } from "@pixel3d/ui";

const id = "toast-undo";

export default function ToastUndo() {
  return (
    <>
      <Toaster id={id} position="bottom-center" />
      <Button
        variant="secondary"
        onClick={() =>
          toast("Vote withdrawn", {
            toasterId: id,
            action: { label: "Undo", onClick: () => toast.success("Vote is back", { toasterId: id }) },
          })
        }
      >
        Withdraw vote
      </Button>
    </>
  );
}
