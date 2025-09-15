import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "NAVADA Robotics | AI & Robotics Innovation",
  description: "Navigating Artistic Vision with Advanced Digital Assistance. Cutting-edge robotics research, AI development, and educational solutions using Raspberry Pi technology.",
  generator: "Next.js",
  keywords: "robotics, AI, Raspberry Pi, automation, computer vision, deep learning, robotics education",
  authors: [{ name: "Lee Akpareva" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} pb-20 md:pb-0`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
