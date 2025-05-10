import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
import Providers from '@/components/Providers'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SyncDraw - Real-time Collaborative Whiteboard',
  description: 'A real-time collaborative whiteboard application built with Next.js, Konva.js, and Yjs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={montserrat.className}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background antialiased')}>
        <Providers>
          <ThemeProvider>
            <main className="min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
} 