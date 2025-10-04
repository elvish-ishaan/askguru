
import Sidebar from '@/components/main/sidebar'
import { ReactNode } from 'react'

interface SidebarLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile, visible on md and up */}
      <aside className="hidden md:block md:w-64 flex-shrink-0">
        <div className="h-full overflow-y-auto">
            <Sidebar/>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
      </main>
    </div>
  )
}
