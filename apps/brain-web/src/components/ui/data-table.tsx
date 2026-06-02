import type { ReactNode } from "react";

import { cn } from "../../lib/class-names";
import { EmptyState } from "./empty-state";

export type DataTableColumnAlign = "left" | "center" | "right";

export interface DataTableColumn<Row extends object> {
  readonly key: keyof Row & string;
  readonly header: string;
  readonly align?: DataTableColumnAlign;
  readonly widthClassName?: string;
  readonly render?: (row: Row) => ReactNode;
}

export interface DataTableProps<Row extends object> {
  readonly caption: string;
  readonly columns: readonly DataTableColumn<Row>[];
  readonly rows: readonly Row[];
  readonly getRowKey: (row: Row, index: number) => string;
  readonly description?: string;
  readonly emptyState?: ReactNode;
  readonly className?: string;
}

const alignClasses: Record<DataTableColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function renderDefaultCell(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return String(value);
}

export function DataTable<Row extends object>({
  caption,
  className,
  columns,
  description,
  emptyState,
  getRowKey,
  rows,
}: DataTableProps<Row>) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-neutral-800 bg-brand-black-soft", className)}>
      <div className="border-b border-neutral-800 px-4 py-3">
        <p className="text-sm font-semibold text-white">{caption}</p>
        {description ? <p className="mt-1 text-sm text-neutral-400">{description}</p> : null}
      </div>
      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-neutral-900 text-xs uppercase text-neutral-400">
              <tr>
                {columns.map((column) => (
                   <th
                     className={cn(
                       "border-b border-neutral-800 px-4 py-2.5 font-semibold",
                       alignClasses[column.align ?? "left"],
                       column.widthClassName,
                     )}
                     key={column.key}
                     scope="col"
                   >
                     {column.header}
                   </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr className="hover:bg-neutral-900/30" key={getRowKey(row, index)}>
                   {columns.map((column) => (
                     <td
                       className={cn(
                         "border-b border-neutral-800/60 px-4 py-3 text-neutral-300",
                         alignClasses[column.align ?? "left"],
                       )}
                       key={column.key}
                     >
                       {column.render ? column.render(row) : renderDefaultCell(row[column.key])}
                     </td>
                   ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4">
          {emptyState ?? (
            <EmptyState
              title="No rows to show"
              description="Rows will appear here after this area has connected data."
            />
          )}
        </div>
      )}
    </div>
  );
}
