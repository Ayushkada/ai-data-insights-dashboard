"use client"

import { useDataset } from "@/lib/data-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DatasetPreviewProps {
  datasetId: string
}

export function DatasetPreview({ datasetId }: DatasetPreviewProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)

  if (!dataset) {
    return <div>Dataset not found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Data (First 10 Rows)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {dataset.columns.map((column) => (
                  <TableHead key={column.name}>{column.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataset.sampleData.slice(0, 10).map((row, index) => (
                <TableRow key={index}>
                  {dataset.columns.map((column) => (
                    <TableCell key={column.name}>{row[column.name]?.toString() || "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
