import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DataProvider } from "@/components/data-provider"
import { ClientNavbar } from "@/components/ClientNavbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Data Science Roadmap",
  description: "A comprehensive data science analysis platform",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataProvider>
          <ClientNavbar />
          {children}
        </DataProvider>
      </body>
    </html>
  )
}
