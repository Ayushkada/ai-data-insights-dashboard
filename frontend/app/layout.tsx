import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SessionDatasetsProvider } from "@/lib/data-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Data Dashboard",
  description: "AI-Powered Data Analysis Dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <SessionDatasetsProvider>
            <Navbar />
            {children}
          </SessionDatasetsProvider>
        </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
