'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type ChangeEvent, useState } from 'react'
import { Input } from './ui/input'

export const SearchForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/'

    router.replace(url, { scroll: false })
  }

  return (
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
          value={query}
          placeholder="Buscar prompts..."
          autoFocus
          className="rounded-none border-none shadow-none outline-none focus-visible:ring-0 dark:bg-transparent"
          onChange={handleQueryChange}
        />
      </label>
    </form>
  )
}
