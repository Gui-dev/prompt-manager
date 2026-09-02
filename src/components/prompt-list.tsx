import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import { PromptCard } from './prompt-card'

interface IPromptListProps {
  prompts: PromptSummary[]
}

export const PromptList = ({ prompts }: IPromptListProps) => {
  return (
    <ul className="space-y-2">
      {prompts.map(prompt => {
        return <PromptCard key={prompt.id} prompt={prompt} />
      })}
    </ul>
  )
}
