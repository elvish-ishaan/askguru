"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  KeyRound,
  BarChart3,
  Plug,
} from "lucide-react"

export default function ProjectSidebar() {
  const pathname = usePathname()
  const {id: projectId} = useParams()

  const links = [
    { name: "General", href: "/general", icon: LayoutDashboard },
    { name: "API Keys", href: "/api-keys", icon: KeyRound },
    { name: "Usage", href: "/usage", icon: BarChart3 },
    { name: "Integrations", href: "/integrations", icon: Plug },
  ]

  return (
    <aside className="w-64 min-h-[80vh] border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 font-medium text-lg border-b ">
        Project Settings
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = `/${pathname.split("/")[3]}` === link.href
          return (
            <Link
              key={link.name}
              href={`/projects/${projectId}${link.href}`}
              className={`flex items-center gap-3 rounded-lg hover:bg-secondary px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                  : "hover:bg-[var(--muted)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
