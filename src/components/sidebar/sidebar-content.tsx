'use client'

import { ArrowLeftToLine, ArrowRightToLine, Loader, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type ChangeEvent, useActionState, useRef, useState } from 'react'
import { searchPromptAction } from '@/app/actions/prompt.action'
import { Input } from '@/components/ui/input'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import { cn } from '@/lib/utils'
import { Logo } from '../logo'
import { PromptList } from '../prompt-list'
import { Button } from '../ui/button'

interface ISidebarContentProps {
  prompts: PromptSummary[]
}

export const SidebarContent = ({ prompts }: ISidebarContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapsedSidebar = () => setIsCollapsed(true)
  const expandedSidebar = () => setIsCollapsed(false)

  const [searchState, searchAction, isPending] = useActionState(searchPromptAction, {
    success: true,
    prompts,
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const hasQuery = query.trim().length > 0
  const promptList = hasQuery ? (searchState.prompts ?? prompts) : prompts

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/'

    router.replace(url, { scroll: false })
    formRef.current?.requestSubmit()
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-50 flex h-full w-[vw] flex-col border-gray-700 border-r bg-gray-800 transition-[transform] duration-300 ease-in-out sm:w-[320px] md:relative md:z-auto',
        isCollapsed ? 'md:w-18' : 'md:w-[384px]'
      )}
    >
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="mb-6 flex flex-col items-center justify-center gap-6">
            <Button
              variant="ghost"
              className="hidden p-2 md:inline-flex"
              aria-label="Expandir sidebar"
              title="Expandir sidebar"
              onClick={expandedSidebar}
            >
              <ArrowRightToLine className="size-5" />
            </Button>

            <Button
              variant="outline"
              className="hidden p-2 md:inline-flex"
              aria-label="Buscar prompts"
              title="Buscar prompts"
              onClick={expandedSidebar}
            >
              <Search className="size-5" />
            </Button>

            <Link
              href="/new"
              className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 p-2 text-gray-800 hover:bg-cyan-400"
              aria-label="Novo prompt"
              title="Novo prompt"
            >
              <Plus className="size-5" />
            </Link>
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
            <form ref={formRef} action={searchAction} className="group relative w-full">
              <label
                htmlFor="q"
                className="flex cursor-text items-center gap-2 rounded-lg border p-1 px-2 transition-colors focus-within:border-gray-400"
              >
                <Search className="size-5" />
                <Input
                  id="q"
                  type="text"
                  name="q"
                  value={query}
                  placeholder="Buscar prompts..."
                  autoFocus
                  className="rounded-none border-none shadow-none outline-none focus-visible:ring-0 dark:bg-transparent"
                  onChange={handleQueryChange}
                />
              </label>

              {isPending && (
                <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
                  <Loader className="size-5 animate-spin" />
                  <p className="sr-only">Buscando...</p>
                </div>
              )}
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

      {!isCollapsed && prompts.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-sm">Nenhum prompt cadastrado</p>
        </div>
      )}

      {!isCollapsed && prompts.length > 0 && (
        <nav
          className="flex flex-1 flex-col overflow-y-auto px-6 pb-6"
          aria-label="Lista de prompts"
        >
          <PromptList prompts={promptList} />
        </nav>
      )}
    </aside>
  )
}
