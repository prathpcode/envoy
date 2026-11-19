import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Table — one straight paper sticker holding a plain HTML table (shadcn part set).
 * The header sits on a 4px ink rule, rows are split by dashed pixel separators,
 * hover tints a row, and data-state="selected" turns it lime. Tables never tilt.
 *
 *   <Table>
 *     <TableHeader><TableRow><TableHead>Team</TableHead></TableRow></TableHeader>
 *     <TableBody><TableRow><TableCell>Null Pointers</TableCell></TableRow></TableBody>
 *   </Table>
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Classes for the sticker that wraps the table. */
  containerClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div data-slot="table-container" className={cn("sticker sticker-lg face-paper w-full p-3", containerClassName)}>
      {/* the sticker draws its silhouette with ::before, so scrolling lives on an inner wrapper */}
      <div className="w-full overflow-x-auto">
        <table
          ref={ref}
          data-slot="table"
          className={cn("w-full caption-bottom border-collapse text-left text-base tabular-nums", className)}
          {...props}
        />
      </div>
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} data-slot="table-header" className={cn("[&>tr]:border-b-4 [&>tr]:border-ink", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} data-slot="table-body" className={cn("table-pixel-rows", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn("border-t-4 border-ink font-extrabold [&>tr:hover]:bg-transparent", className)}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn(
        "transition-colors duration-150 hover:bg-[#cdd1d8]/45",
        "data-[state=selected]:bg-lime data-[state=selected]:hover:bg-lime",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      data-slot="table-head"
      className={cn(
        "h-12 whitespace-nowrap px-4 text-left align-middle text-base font-extrabold tracking-[-0.01em] text-ink",
        "[&:has([role=checkbox])]:w-14 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      data-slot="table-cell"
      className={cn(
        "px-4 py-3.5 align-middle text-base font-medium text-ink",
        "[&:has([role=checkbox])]:w-14 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} data-slot="table-caption" className={cn("mt-3 px-4 pb-1 text-left text-sm text-ink-soft", className)} {...props} />
  )
);
TableCaption.displayName = "TableCaption";
