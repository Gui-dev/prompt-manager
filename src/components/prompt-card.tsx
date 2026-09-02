import Link from 'next/link'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'

interface IPromptCardProps {
  prompt: PromptSummary
}

export const PromptCard = ({ prompt }: IPromptCardProps) => {
  return (
    <li className="group relative cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-gray-700">
      <Link href={`/prompts/${prompt.id}`} prefetch className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col items-start justify-between">
          <h3 className="font-medium text-sm text-white transition-colors hover:text-accent-foreground">
            {prompt.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-muted-foreground text-xs">{prompt.content}</p>
        </header>
      </Link>
    </li>
  )
}
