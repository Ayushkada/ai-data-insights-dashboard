import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardDataProvider } from "@/lib/data-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardDataProvider>
        <DashboardSidebar>
          {children}
        </DashboardSidebar>
      </DashboardDataProvider>
    </SidebarProvider>
  )
}