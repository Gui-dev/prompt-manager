'use server'

import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
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

  try {
    const prompts = await prisma.prompt.findMany({
      where: term
        ? {
            OR: [
              {
                title: {
                  contains: term,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: term,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
    })

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
