import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatasetMeta } from "@/types/upload"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatBytes } from "@/lib/utils";

interface DatasetCardProps {
  dataset: DatasetMeta
}

function ColumnBadges({ columns }: { columns: string[] }) {
  const maxToShow = 4;
  const shown = columns.slice(0, maxToShow);
  const remaining = columns.length - maxToShow;
  const remainingCols = columns.slice(maxToShow);

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((col) => (
        <Badge key={col} variant="secondary" className="bg-muted text-muted-foreground border border-border font-normal">{col}</Badge>
      ))}
      {remaining > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="cursor-pointer bg-muted text-muted-foreground border border-border font-normal">+{remaining} more</Badge>
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
  // Helper to format file size in MB
  return (
    <Card
      tabIndex={0}
      className="h-full flex flex-col transition-transform transition-shadow cursor-pointer bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/40 group
    hover:bg-muted hover:border-primary focus:border-primary hover:text-primary"
      role="button"
      aria-label={`View dataset ${dataset.title || dataset.filename}`}
    >
      <CardHeader className="px-6 pb-4">
        <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
          {dataset.title || dataset.filename}
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-1">
          {dataset.size && dataset.size > 0 && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border font-normal">
              {formatBytes(dataset.size)}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border font-normal">
            {dataset.num_rows} rows
          </Badge>
          <ColumnBadges columns={dataset.columns || []} />
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
          {dataset.summary}
        </p>
      </CardContent>
    </Card>
  )
}
