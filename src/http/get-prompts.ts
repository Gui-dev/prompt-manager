import { prisma } from '@/lib/prisma'

export const getPrompts = () => {
  return prisma.prompt.findMany({ orderBy: { createdAt: 'desc' } })
}
