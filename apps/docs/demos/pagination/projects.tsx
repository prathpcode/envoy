"use client";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@pixel3d/ui";

const TOTAL = 12;

function pagesAround(page: number) {
  const pages = new Set([1, TOTAL, page - 1, page, page + 1]);
  return [...pages].filter((p) => p >= 1 && p <= TOTAL).sort((a, b) => a - b);
}

export default function PaginationProjects() {
  const [page, setPage] = React.useState(4);
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPage(Math.min(TOTAL, Math.max(1, p)));
  };
  const pages = pagesAround(page);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={go(page - 1)} aria-disabled={page === 1 || undefined} />
        </PaginationItem>
        {pages.map((p, i) => (
          <React.Fragment key={p}>
            {i > 0 && p - pages[i - 1] > 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          </React.Fragment>
        ))}
        <PaginationItem>
          <PaginationNext href="#" onClick={go(page + 1)} aria-disabled={page === TOTAL || undefined} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
