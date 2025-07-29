"use client"

import { useDataset } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SummaryStatsProps {
  datasetId: string
}

export function SummaryStats({ datasetId }: SummaryStatsProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)

  if (!dataset) {
    return <div>Dataset not found</div>
  }

  const numericColumns = dataset.columns.filter((col) => col.type === "numeric")

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Mean</TableHead>
                <TableHead>Std Dev</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {numericColumns.map((column) => (
                <TableRow key={column.name}>
                  <TableCell className="font-medium">{column.name}</TableCell>
                  <TableCell>42.5</TableCell>
                  <TableCell>12.3</TableCell>
                  <TableCell>1.2</TableCell>
                  <TableCell>98.7</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribution Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
            Histogram/Boxplot placeholder - integrate with Recharts
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
