import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg font-bold text-2xl transition-colors hover:text-accent"
    >
      <MessageSquare className="size-5" />
      <h1 className="font-semibold text-lg">Prompt Manager</h1>
    </Link>
  )
}
