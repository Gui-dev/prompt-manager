import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/sidebar'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Prompt Manager',
  description: 'Gererate and manage your prompts',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn('dark font-sans', inter.variable)}>
      <body className="flex h-screen antialiased">
        <Sidebar />
        <main className="relative min-w-0 flex-1 overflow-auto">
          <div className="mx-auto h-full max-w-full p-4 sm:p-6 md:max-w-3xl md:p-8">{children}</div>
        </main>
      </body>
    </html>
  )
}
