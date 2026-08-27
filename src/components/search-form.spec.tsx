import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchForm } from './search-form'

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

const makeSut = () => {
  return render(<SearchForm />)
}

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
