"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {} from 'next-auth'
import { signIn, useSession } from "next-auth/react"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const {data: session} = useSession()
  console.log(session,'gettin gsession')

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="w-full bg-background text-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          AskGuru
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" onClick={() => signIn("google", {
            callbackUrl: "/projects"
          })}>Login</Button>
          <Button onClick={() => signIn("google", {
            callbackUrl: "/projects"
          })} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90">
            Sign Up
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[var(--background)]">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium transition-colors hover:text-[var(--primary)]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 flex flex-col gap-3">
                  <Button variant="ghost" onClick={() => signIn("google", {
            callbackUrl: "/projects"
          })} className="w-full">
                    Login
                  </Button>
                  <Button className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                  onClick={() => signIn("google", {
            callbackUrl: "/projects"
          })}
                  >
                    Sign Up
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
