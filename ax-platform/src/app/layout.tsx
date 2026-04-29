import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AX 업무자동화 플랫폼',
  description: 'AX Automation Platform for Sales & Inventory Intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
