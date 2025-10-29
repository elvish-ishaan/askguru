"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <header className=" fixed top-0 left-0 w-full z-50  bg-[#1a1a1a]/40 backdrop-blur-lg border-b border-white/10 text-white ">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="">
          <Image src="/askguruLogo.png" alt="askguru_logo" width={120} height={120} />
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
          <Button
            onClick={() => router.push("/auth")}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
               hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400
               transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]
               backdrop-blur-sm"
          >
            Get Started
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

            <SheetContent
              side="right"
              className="bg-[#1a1a1a]/40 backdrop-blur-lg border-b border-white/10 text-white w-64 p-6 flex flex-col "
            >
              <nav className="flex flex-col gap-6 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-semibold text-center transition-colors hover:text-[var(--primary)]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="w-full">
                <button
                  onClick={() => {
                    router.push("/auth");
                    setOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
               hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400
               transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]
               backdrop-blur-sm"
                >
                  Get Started
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
