import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity'
import { SidebarContent } from './sidebar-content'

const { routerMock } = vi.hoisted(() => ({
  routerMock: {
    push: vi.fn(),
    replace: vi.fn(),
  },
}))
let searchParams = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  useSearchParams: () => searchParams,
}))

const prompts: PromptSummary[] = [
  { id: '1', title: 'Prompt 1', content: 'Content 1' },
  { id: '2', title: 'Prompt 2', content: 'Content 2' },
]

const makeSut = () => {
  return render(<SidebarContent prompts={prompts} />)
}

describe('<SidebarContent />', () => {
  const user = userEvent.setup()

  it('should be rendered link to create prompt', () => {
    makeSut()

    expect(screen.getByRole('complementary')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Novo prompt' })).toBeVisible()
  })

  it('should be possible to update the search field as you type.', async () => {
    makeSut()

    const text = 'AI'
    const searchInput = screen.getByPlaceholderText(/Buscar prompts.../i)
    await user.type(searchInput, text)

    expect(searchInput).toHaveValue(text)
  })

  describe('Expand / Collapse', () => {
    it('should initialize expanded sidebar', () => {
      makeSut()

      const aside = screen.getByRole('complementary')

      expect(aside).toBeVisible()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })

      expect(collapseButton).toBeVisible()

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      })

      expect(expandButton).not.toBeInTheDocument()
    })

    it('should collapse and show the expand button', async () => {
      makeSut()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })

      await user.click(collapseButton)

      const expandButton = screen.getByRole('button', {
        name: /expandir sidebar/i,
      })

      expect(expandButton).toBeVisible()
      expect(collapseButton).not.toBeInTheDocument()
    })

    it('should be able to display the "create new prompt" button in the minimized sidebar.', async () => {
      makeSut()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })
      await user.click(collapseButton)

      const newPromptButton = screen.getByRole('link', {
        name: 'Novo prompt',
      })

      expect(newPromptButton).toBeVisible()
    })

    it('should not be able to render prompts list in the minimized sidebar.', async () => {
      makeSut()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })
      await user.click(collapseButton)

      const promptsList = screen.queryByRole('navigation', {
        name: 'Lista de prompts',
      })

      expect(promptsList).not.toBeInTheDocument()
    })
  })

  describe('<SearchForm />', () => {
    const user = userEvent.setup()

    beforeEach(() => {
      searchParams = new URLSearchParams()
    })

    it('should be possible to navigate with URL-encoded text by typing and clearing.', async () => {
      makeSut()

      const text = 'A B'
      const searchInput = screen.getByPlaceholderText(/Buscar prompts.../i)
      await user.type(searchInput, text)

      expect(routerMock.replace).toHaveBeenCalled()
      const lastCall = routerMock.replace.mock.calls.at(-1)
      expect(lastCall?.[0]).toBe(`/?q=${encodeURIComponent(text)}`)

      await user.clear(searchInput)

      const lastClear = routerMock.replace.mock.calls.at(-1)
      expect(lastClear?.[0]).toBe('/')
    })

    it('should be possible to initialize the search field with the search parameter.', async () => {
      const text = 'test'
      searchParams = new URLSearchParams({ q: text }) // ?q=test
      makeSut()
      const searchInput = screen.getByPlaceholderText(/Buscar prompts.../i)

      expect(searchInput).toHaveValue(text)
    })
  })

  describe('New Prompt', () => {
    it('should have a link to the new prompt page', () => {
      makeSut()

      const button = screen.getByRole('link', { name: 'Novo prompt' })

      expect(button).toHaveAttribute('href', '/new')
    })
  })

  describe('Prompt List', () => {
    it('should render prompt list', () => {
      makeSut()

      expect(screen.getByText(prompts[0].title)).toBeInTheDocument()
    })
  })
})
