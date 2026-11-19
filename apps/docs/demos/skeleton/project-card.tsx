import { Skeleton } from "@pixel3d/ui";

export default function SkeletonProjectCard() {
  return (
    <div aria-busy="true" aria-label="Loading projects" className="flex w-full max-w-md flex-col gap-8">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-5">
          <Skeleton className="size-14 shrink-0" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
