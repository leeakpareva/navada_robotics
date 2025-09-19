import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { SessionProvider } from "@/components/SessionProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "NAVADA Robotics | AI & Robotics Innovation",
  description: "Navigating Artistic Vision with Advanced Digital Assistance. Cutting-edge robotics research, AI development, and educational solutions using Raspberry Pi technology.",
  generator: "Next.js",
  keywords: "robotics, AI, Raspberry Pi, automation, computer vision, deep learning, robotics education",
  authors: [{ name: "Lee Akpareva" }],
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes"
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <link rel="preload" href="/api/auth/session" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="//va.vercel-scripts.com" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} pb-safe md:pb-0 overflow-x-hidden`}>
        <SessionProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
