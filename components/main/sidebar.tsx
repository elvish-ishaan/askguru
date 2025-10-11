"use client"

import Link from "next/link"
import { useState } from "react"
import { LayoutDashboard, Settings, BarChart2, CreditCard, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "./themeToggle"

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: "/projects", label: "Projects", icon: LayoutDashboard },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/usage", label: "Usage", icon: BarChart2 },
    { href: "/billing", label: "Billing", icon: CreditCard },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between">
      {/* Top Section */}
      <nav className="mt-10 flex flex-col gap-2">
        <span className=" text-2xl font-medium text-start mx-4 text-primary">Console</span>
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 border-t flex justify-center gap-2 mx-auto">
        <ThemeToggle position="top"/>
        <Button
          onClick={() => signOut({callbackUrl: "/"})}
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <aside className="w-64 h-screen border-r bg-[var(--sidebar)] hidden md:flex flex-col">
      <SidebarContent />

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="m-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[var(--sidebar)]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </aside>
  )
}
