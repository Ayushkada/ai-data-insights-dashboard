// "use client"

// import { useSearchParams } from "next/navigation"
// import { AppSidebar } from "@/components/app-sidebar"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { AnalyticsTabs } from "@/components/analytics-tabs"
// import { useDataContext } from "@/components/data-provider"
// import { useEffect } from "react"

// export default function DashboardPage() {
//   const searchParams = useSearchParams()
//   const datasetId = searchParams.get("dataset")
//   const { currentDataset, setCurrentDataset, datasets } = useDataContext()

//   useEffect(() => {
//     if (datasetId && datasets.length > 0) {
//       const dataset = datasets.find((d) => d.id === datasetId)
//       if (dataset) {
//         setCurrentDataset(dataset)
//       }
//     }
//   }, [datasetId, datasets, setCurrentDataset])

//   if (!currentDataset) {
//     return (
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset>
//           <div className="flex items-center justify-center min-h-screen">
//             <div className="text-center space-y-4">
//               <h2 className="text-2xl font-semibold text-gray-700">No Dataset Selected</h2>
//               <p className="text-gray-500">Please select a dataset from the home page to continue.</p>
//             </div>
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//     )
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <div className="min-h-screen bg-gray-50">
//           <DashboardHeader dataset={currentDataset} />
//           <div className="max-w-7xl mx-auto p-6">
//             <AnalyticsTabs dataset={currentDataset} />
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
