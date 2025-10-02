import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Network Device Inventory',
  description: 'Comprehensive network device management and tracking system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}