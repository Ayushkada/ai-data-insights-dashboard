"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye } from "lucide-react"

interface DataPreviewProps {
  data: Record<string, any>[]
}

export function DataPreview({ data }: DataPreviewProps) {
  const previewData = data.slice(0, 20)
  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <Card className="bg-white rounded-2xl shadow-md border-0">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Eye className="h-5 w-5 text-indigo-600" />
          Dataset Preview
        </CardTitle>
        <CardDescription className="text-gray-600">
          Showing first {previewData.length} rows of {data.length} total rows
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ScrollArea className="h-96 w-full rounded-lg border border-gray-200">
          <Table className="table-auto">
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow className="border-b border-gray-200">
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold text-left text-gray-900 p-4">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {previewData.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column} className="font-mono text-sm text-gray-700 p-4">
                      {String(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
