import type { IPromptsRepository } from '@/core/domain/prompts/prompts.repository'
import type { PrismaClient, Prompt } from '@/generated/prisma/client'

export class PrismaPromptRepository implements IPromptsRepository {
  constructor(private prisma: PrismaClient) {}

  public async findMany(): Promise<Prompt[]> {
    const prompts = await this.prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return prompts
  }
  public async search(term: string): Promise<Prompt[]> {
    const query = term?.trim() ?? ''

    const prompts = await this.prisma.prompt.findMany({
      where: query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return prompts
  }
}
