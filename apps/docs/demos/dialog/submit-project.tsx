"use client";
import * as React from "react";
import { ArrowRight } from "pixelarticons/react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@pixel3d/ui";

export default function DialogSubmitProject() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          Submit project <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit your project</DialogTitle>
          <DialogDescription>You can edit it until judging opens at 10:00.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <Input label="Project name" placeholder="Pixel Pets" required />
          <Input label="Repo URL" type="url" placeholder="https://github.com/null-pointers/pixel-pets" required />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Not yet
              </Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
