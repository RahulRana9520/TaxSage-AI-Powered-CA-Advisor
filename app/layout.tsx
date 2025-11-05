import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaxSage - AI-Powered CA Advisor",
  description: "Smart financial management with AI-powered credit analysis and CA advisory services",
  generator: "TaxSage",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaxSage",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TaxSage",
    title: "TaxSage - AI-Powered CA Advisor",
    description: "Your Smart Tax & Financial Assistant",
  },
  twitter: {
    card: "summary",
    title: "TaxSage - AI-Powered CA Advisor",
    description: "Your Smart Tax & Financial Assistant",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TaxSage" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="TaxSage" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icon-192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icon-512.svg" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_20%,rgba(124,58,237,0.25),transparent),radial-gradient(50%_30%_at_80%_10%,rgba(34,211,238,0.18),transparent),radial-gradient(70%_50%_at_50%_100%,rgba(124,58,237,0.18),transparent)]" />
          </div>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
