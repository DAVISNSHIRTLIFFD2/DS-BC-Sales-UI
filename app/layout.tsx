import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppProvider } from "@/context/app-context"
import { ConvaiWidget } from "@/components/convail-widget"

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
})

export const metadata: Metadata = {
  title: "Davis & Shirtliff Sales Assistant",
  description: "AI-powered sales conversion assistant for Davis & Shirtliff water and energy solutions",
  keywords: "sales, CRM, water solutions, energy solutions, Davis & Shirtliff",
  authors: [{ name: "Davis & Shirtliff" }],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-figtree">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <AppSidebar />
                <div className="flex-1 min-w-0 flex flex-col">{children}</div>
              </div>
              <div className="fixed bottom-4 right-4 z-50">
                <ConvaiWidget />
              </div>
            </SidebarProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'