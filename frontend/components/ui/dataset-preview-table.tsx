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
    <div className={className}>
      <table className="w-max min-w-full text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap border-b"
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
                className="px-3 py-4 text-center text-muted-foreground"
              >
                No preview data available.
              </td>
            </tr>
          ) : (
            sample_rows.map((row, i) => (
              <tr key={i} className="even:bg-background">
                {columns.map((col) => {
                  const value = row[col]
                  let display =
                    value === undefined || value === null ? "—" : String(value)
                  if (display.length > 32) display = display.slice(0, 29) + "..."
                  return (
                    <td
                      key={col}
                      className="px-3 py-2 max-w-xs truncate whitespace-nowrap border-b"
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
