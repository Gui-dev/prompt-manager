import { render, screen } from '@testing-library/react'
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
})
