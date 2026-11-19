import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@pixel3d/ui";

export default function PaginationLabels() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#">Day 1</PaginationPrevious>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#">Day 3</PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
