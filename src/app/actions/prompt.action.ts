'use server'

import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository'
import { prisma } from '@/lib/prisma'

interface ISearchFormState {
  success: boolean
  message?: string
  prompts?: PromptSummary[]
}

export const searchPromptAction = async (
  _prev: ISearchFormState,
  data: FormData
): Promise<ISearchFormState> => {
  const term = String(data.get('q') ?? '').trim()
  const promptsRepository = new PrismaPromptRepository(prisma)
  const searchPrompysUseCase = new SearchPromptsUseCase(promptsRepository)

  try {
    const prompts = await searchPrompysUseCase.execute(term)
    const summaries = prompts.map(({ id, title, content }) => {
      return {
        id,
        title,
        content,
      }
    })

    return {
      success: true,
      prompts: summaries,
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: 'Ocorreu um erro ao buscar prompts',
    }
  }
}
