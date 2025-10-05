"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">AskGuru</h2>
            <p className="mt-3 text-sm leading-6">
              AI-powered knowledge assistant for your apps, docs, and teams.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/features" className="hover:text-[var(--primary)] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--primary)] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[var(--primary)] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--primary)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[var(--primary)] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[var(--primary)] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[var(--primary)] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Connect</h3>
            <div className="mt-4 flex gap-4">
              <Link href="https://github.com" target="_blank" className="hover:text-[var(--primary)]">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="hover:text-[var(--primary)]">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="hover:text-[var(--primary)]">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="mailto:hello@askguru.com" className="hover:text-[var(--primary)]">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-[var(--border)] pt-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© {new Date().getFullYear()} AskGuru. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--primary)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
