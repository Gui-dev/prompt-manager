import type { Prompt } from '@/generated/prisma/client'

export interface IPromptsRepository {
  findMany(): Promise<Prompt[]>
  search(query: string): Promise<Prompt[]>
}
