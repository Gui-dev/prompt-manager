import { faker } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

const PROMPT_TITLES = [
  'Summarize text',
  'Translate to Portuguese',
  'Write email draft',
  'Code review assistant',
  'Explain concept',
  'Brainstorm ideas',
  'Rewrite paragraph',
  'Generate SQL query',
  'Debug code error',
  'Write unit tests',
  'Create API endpoint',
  'Refactor function',
  'Write documentation',
  'Analyze data trend',
  'Design system prompt',
  'Format JSON output',
  'Parse CSV data',
  'Validate input form',
  'Cache strategy advisor',
  'Error handling guide',
]

async function main() {
  console.log('Seeding database...')

  for (const title of PROMPT_TITLES) {
    const content = faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n')

    await prisma.prompt.create({
      data: { title, content },
    })
  }

  console.log(`Seeded ${PROMPT_TITLES.length} prompts.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
