import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type IPrompt, SidebarContent } from './sidebar-content'

const { routerMock } = vi.hoisted(() => ({
  routerMock: {
    push: vi.fn(),
    replace: vi.fn(),
  },
}))
const { useSearchParams } = vi.hoisted(() => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  useSearchParams,
}))

const prompts: IPrompt[] = [
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
