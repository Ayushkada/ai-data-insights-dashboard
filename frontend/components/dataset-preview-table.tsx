import React from "react"

export interface FilePreview {
  columns: string[]
  sample_rows: Record<string, any>[]
}

interface DatasetPreviewTableProps {
  preview: FilePreview
  className?: string
}

export const DatasetPreviewTable: React.FC<DatasetPreviewTableProps> = ({
  preview,
  className = "",
}) => {
  const { columns, sample_rows } = preview || { columns: [], sample_rows: [] }

  return (
    <div className={`w-full overflow-x-auto rounded-lg border bg-background ${className}`}>
      <table className="min-w-full text-sm align-middle">
        <thead>
          <tr className="bg-muted dark:bg-muted/60">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap border-b border-border"
                scope="col"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sample_rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-muted-foreground"
              >
                No preview data available.
              </td>
            </tr>
          ) : (
            sample_rows.map((row, i) => (
              <tr
                key={i}
                className="even:bg-muted/50 hover:bg-accent focus-within:bg-accent transition-colors"
              >
                {columns.map((col) => {
                  const value = row[col]
                  let display =
                    value === undefined || value === null ? "—" : String(value)
                  if (display.length > 32) display = display.slice(0, 29) + "..."
                  return (
                    <td
                      key={col}
                      className="px-4 py-3 max-w-xs truncate whitespace-nowrap border-b border-border text-foreground"
                      title={
                        value === undefined || value === null
                          ? undefined
                          : String(value)
                      }
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
