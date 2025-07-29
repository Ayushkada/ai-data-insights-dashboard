import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatasetMeta } from "@/app/upload/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DatasetCardProps {
  dataset: DatasetMeta
}

function ColumnBadges({ columns }: { columns: string[] }) {
  const maxToShow = 3;
  const shown = columns.slice(0, maxToShow);
  const remaining = columns.length - maxToShow;
  const remainingCols = columns.slice(maxToShow);

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((col) => (
        <Badge key={col} variant="secondary">{col}</Badge>
      ))}
      {remaining > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="cursor-pointer">+{remaining} more</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs break-words">
              {remainingCols.join(", ")}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{dataset.title || dataset.filename}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{dataset.num_rows} rows</Badge>
            <ColumnBadges columns={dataset.columns || []} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{dataset.summary}</p>
        </CardContent>
      </Card>
  )
}
