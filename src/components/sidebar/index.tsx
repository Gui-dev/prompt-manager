import { getPrompts } from '@/http/get-prompts'
import { SidebarContent } from './sidebar-content'

export const Sidebar = async () => {
  const prompts = await getPrompts()

  return (
    <div>
      <SidebarContent prompts={prompts} />
    </div>
  )
}
