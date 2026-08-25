'use client'

import { ArrowLeftToLine, ArrowRightToLine, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '../logo'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export interface IPrompt {
  id: string
  title: string
  content: string
}

interface ISidebarContentProps {
  prompts: IPrompt[]
}

export const SidebarContent = ({ prompts }: ISidebarContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapsedSidebar = () => setIsCollapsed(true)
  const expandedSidebar = () => setIsCollapsed(false)

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-50 flex h-full w-[vw] flex-col border-gray-700 border-r bg-gray-800 transition-[transform] duration-300 ease-in-out sm:w-[320px] md:relative md:z-auto',
        isCollapsed ? 'md:w-18' : 'md:w-[384px]'
      )}
    >
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="mb-6 flex items-center justify-center">
            <Button
              variant="ghost"
              className="hidden p-2 md:inline-flex"
              aria-label="Expandir sidebar"
              title="Expandir sidebar"
              onClick={expandedSidebar}
            >
              <ArrowRightToLine className="size-5" />
            </Button>
          </header>
        </section>
      )}

      {!isCollapsed && (
        <section className="p-6">
          <div className="mb-4 md:hidden">
            <div className="flex items-center justify-between">
              <Button variant="ghost" aria-label="Fechar sidebar" title="Fechar sidebar">
                <X className="size-5" />
              </Button>
            </div>
          </div>

          <div className="mb-6 flex w-full items-center justify-between">
            <header className="flex w-full items-center justify-between">
              <Logo />
              <Button
                variant="secondary"
                className="hidden p-2 md:inline-flex"
                aria-label="Minimizar sidebar"
                title="Minimizar sidebar"
                onClick={collapsedSidebar}
              >
                <ArrowLeftToLine className="size-5" />
              </Button>
            </header>
          </div>

          <div className="mb-4">
            <form>
              <label
                htmlFor="q"
                className="flex cursor-text items-center gap-2 rounded-lg border p-1 px-2 transition-colors focus-within:border-gray-400"
              >
                <Search className="size-5" />
                <Input
                  id="q"
                  type="text"
                  name="q"
                  placeholder="Buscar prompts..."
                  autoFocus
                  className="rounded-none border-none shadow-none outline-none focus-visible:ring-0 dark:bg-transparent"
                />
              </label>
            </form>
          </div>

          <div>
            <Link
              href="/new"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 p-2 text-gray-800 hover:bg-cyan-400"
            >
              <Plus className="size-5" />
              <span>Novo prompt</span>
            </Link>
          </div>
        </section>
      )}
    </aside>
  )
}
