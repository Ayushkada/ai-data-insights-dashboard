"use client"

import * as React from "react"
import {
  BarChart3,
  Brain,
  Database,
  GitBranch,
  LineChart,
  PieChart,
  ScatterChartIcon as Scatter3D,
  TrendingUp
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { UploadButton } from "@/components/upload-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDashboardData, DashboardDataProvider } from "@/lib/data-provider"
import { Badge } from "@/components/ui/badge"
import { formatBytes } from "@/lib/utils"

const navigationItems = [
  {
    title: "Overview",
    icon: Database,
    id: "overview",
  },
  {
    title: "Univariate",
    icon: BarChart3,
    id: "univariate",
  },
  {
    title: "Bivariate",
    icon: Scatter3D,
    id: "bivariate",
  },
  {
    title: "Statistical Tests",
    icon: PieChart,
    id: "statistical-tests",
  },
  {
    title: "Modeling",
    icon: GitBranch,
    id: "modeling",
  },
  {
    title: "Clustering",
    icon: TrendingUp,
    id: "clustering",
  },
  {
    title: "Time Series",
    icon: LineChart,
    id: "time-series",
  },
  {
    title: "Insights",
    icon: Brain,
    id: "insights",
  },
]

function DashboardHeaderTitle() {
  const data = useDashboardData();
  let title = "";
  let size = null;
  let numRows = null;
  let numCols = null;
  if (data?.meta) {
    if (data.meta.title && data.meta.title.trim()) {
      title = data.meta.title;
    } else if (data.meta.filename) {
      title = data.meta.filename;
    }
    size = data.meta.size;
    numRows = data.meta.num_rows;
    numCols = data.meta.columns?.length;
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      {size !== null && (
        <Badge variant="secondary" title="File size">{formatBytes(size)}</Badge>
      )}
      {numRows !== null && (
        <Badge variant="secondary" title="Number of rows">{numRows} rows</Badge>
      )}
      {numCols !== null && (
        <Badge variant="secondary" title="Number of columns">{numCols} cols</Badge>
      )}
    </div>
  );
}

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (id: string) => {
    if (id === "overview") {
      return pathname === "/dashboard" || pathname === "/dashboard/overview";
    }
    return pathname === `/dashboard/${id}`;
  };
  return (
    <DashboardDataProvider>
      <>
        <Sidebar className="border-r border-border/60 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/95">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-gradient-primary text-lg">DataScope</span>
                <span className="text-xs text-muted-foreground">AI Analytics Platform</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild isActive={isActive(item.id)} className="sidebar-item">
                              <Link href={item.id === "overview" ? "/dashboard" : `/dashboard/${item.id}`} className="w-full flex items-center gap-2">
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.title} Analysis</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <UploadButton />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/60 navbar-gradient px-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 rounded-xl" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-white/20" />
              <DashboardHeaderTitle />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50/50 via-white to-indigo-50/30 dark:from-gray-950/50 dark:via-gray-900 dark:to-indigo-950/30">
            <div>{children}</div>
          </main>
        </SidebarInset>
      </>
    </DashboardDataProvider>
  )
}
