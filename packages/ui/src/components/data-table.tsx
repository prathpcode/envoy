"use client";
import * as React from "react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type Row,
  type RowData,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search, SortVertical } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

/**
 * DataTable — a ready-made table on TanStack Table v9: sorting (pixel arrows),
 * a global search, checkbox row selection and pagination. Sits on the same straight
 * paper sticker as <Table>.
 *
 *   const col = createDataTableColumnHelper<Project>();
 *   const columns = col.columns([col.accessor("name", { header: "Project" })]);
 *   <DataTable columns={columns} data={projects} getRowId={(p) => p.id} />
 *
 * Keep `columns` and `data` stable (module scope, state or useMemo).
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic, datetime: sortFn_datetime },
  filterFns: { includesString: filterFn_includesString },
});
export type DataTableFeatures = typeof dataTableFeatures;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

/** A column helper typed for DataTable's feature set. */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  /** Stable row ids keep selection right across sorting and pages. Defaults to the index. */
  getRowId?: (row: TData, index: number) => string;
  /** Adds a checkbox column. Shift-click selects a range. */
  enableRowSelection?: boolean;
  /** Shows the search field. */
  enableSearch?: boolean;
  /** Accessible name and placeholder of the search field. */
  searchLabel?: string;
  pageSize?: number;
  /** Shown in the body when nothing matches. */
  emptyMessage?: React.ReactNode;
  /** Called with the selected rows' original data whenever selection changes. */
  onSelectionChange?: (rows: TData[]) => void;
  /** Extra controls placed next to the search field (e.g. a Button). */
  toolbar?: React.ReactNode;
  className?: string;
}

function SortIcon({ dir }: { dir: false | "asc" | "desc" }) {
  if (dir === "asc") return <ArrowUp aria-hidden className="pixel-icon size-5" />;
  if (dir === "desc") return <ArrowDown aria-hidden className="pixel-icon size-5" />;
  return <SortVertical aria-hidden className="pixel-icon size-5 opacity-45 group-hover/sort:opacity-100" />;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  enableRowSelection = true,
  enableSearch = true,
  searchLabel = "Search",
  pageSize = 8,
  emptyMessage = "Nothing matches that search.",
  onSelectionChange,
  toolbar,
  className,
}: DataTableProps<TData>) {
  const allColumns = React.useMemo<DataTableColumnDef<TData>[]>(() => {
    if (!enableRowSelection) return columns;
    const select: DataTableColumnDef<TData> = {
      id: "__select",
      enableSorting: false,
      enableGlobalFilter: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows on this page"
          checked={
            table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
        />
      ),
      cell: ({ row }) => <RowCheckbox row={row} />,
    };
    return [select, ...columns];
  }, [columns, enableRowSelection]);

  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    getRowId,
    enableRowSelection,
    globalFilterFn: "includesString",
    isRowRangeSelectionEvent: (e) => Boolean((e as { shiftKey?: boolean }).shiftKey),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const rowSelection = table.state.rowSelection;
  const onSelectionChangeRef = React.useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  React.useEffect(() => {
    onSelectionChangeRef.current?.(table.getSelectedRowModel().rows.map((r) => r.original));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const rows = table.getRowModel().rows;
  const pageCount = Math.max(1, table.getPageCount());
  const pageIndex = Math.min(table.state.pagination.pageIndex + 1, pageCount);
  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;
  const colCount = table.getAllLeafColumns().length;

  return (
    <div data-slot="data-table" className={cn("flex w-full flex-col gap-5", className)}>
      {(enableSearch || toolbar) && (
        <div className="flex flex-wrap items-center gap-4">
          {enableSearch && (
            <Input
              aria-label={searchLabel}
              placeholder={searchLabel}
              type="search"
              leading={<Search />}
              wrapperClassName="max-w-sm"
              value={String(table.state.globalFilter ?? "")}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
            />
          )}
          {toolbar && <div className="ml-auto flex items-center gap-3">{toolbar}</div>}
        </div>
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const dir = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={canSort ? (dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none") : undefined}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="group/sort -mx-2 inline-flex h-10 cursor-pointer items-center gap-2 px-2 font-extrabold hover:bg-[#cdd1d8]/45"
                      >
                        <table.FlexRender header={header} />
                        <SortIcon dir={dir} />
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colCount} className="h-28 text-center text-ink-soft">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-4 text-on-lid">
        <p className="text-base font-bold tabular-nums text-on-lid-soft" aria-live="polite">
          {enableRowSelection && selectedCount > 0 ? `${selectedCount} selected` : ""}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-base font-bold tabular-nums">
            Page {pageIndex} of {pageCount}
          </span>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function RowCheckbox<TData extends RowData>({ row }: { row: Row<DataTableFeatures, TData> }) {
  const selected = row.getIsSelected();
  return (
    <Checkbox
      aria-label="Select row"
      checked={selected}
      disabled={!row.getCanSelect()}
      // the TanStack handler reads target.checked + shiftKey (Shift-click = range)
      onClick={(e) => row.getToggleSelectedHandler()({ target: { checked: !selected }, shiftKey: e.shiftKey })}
    />
  );
}
