"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  KeyRound,
  BarChart3,
  Plug,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "General", href: "/project/general", icon: LayoutDashboard },
    { name: "API Keys", href: "/project/apikeys", icon: KeyRound },
    { name: "Usage", href: "/project/usage", icon: BarChart3 },
    { name: "Integrations", href: "/project/integrations", icon: Plug },
  ]

  return (
    <aside className="w-64 min-h-[80vh] border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 font-bold text-lg border-b">
        Project Panel
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
