import type { IPromptsRepository } from '@/core/domain/prompts/prompts.repository'
import type { Prompt } from '@/generated/prisma/client'

export class SearchPromptsUseCase {
  constructor(private promptsRepository: IPromptsRepository) {}

  public async execute(term?: string): Promise<Prompt[]> {
    const query = term?.trim() ?? ''

    if (!query) {
      return this.promptsRepository.findMany()
    }

    return this.promptsRepository.search(query)
  }
}
