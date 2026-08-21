import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '.'

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const makeSut = () => {
  return render(<Sidebar />)
}

describe('Sidebar', () => {
  const user = userEvent.setup()

  it('should be rendered link to create prompt', () => {
    makeSut()

    expect(screen.getByRole('complementary')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Novo prompt' })).toBeVisible()
  })

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
