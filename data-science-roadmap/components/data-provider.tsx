"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Dataset {
  id: string
  title: string
  // Add other fields as needed for current dataset context
}

interface DataContextType {
  currentDataset: Dataset | null
  setCurrentDataset: (dataset: Dataset | null) => void
  navbarRefreshKey: number
  refreshNavbar: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null)
  const [navbarRefreshKey, setNavbarRefreshKey] = useState(0)

  const refreshNavbar = () => setNavbarRefreshKey(k => k + 1)

  return (
    <DataContext.Provider
      value={{
        currentDataset,
        setCurrentDataset,
        navbarRefreshKey,
        refreshNavbar,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}
