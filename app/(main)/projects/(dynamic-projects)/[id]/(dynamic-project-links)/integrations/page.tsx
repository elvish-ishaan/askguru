"use client"

import { Card, CardContent } from "@/components/ui/card"
import {  PlugZap, Loader2 } from "lucide-react"

export default function IntegrationsComingSoon() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6 py-12">
      <Card className="max-w-lg w-full border border-[var(--border)] bg-[var(--card)] shadow-lg text-center p-8">
        <CardContent className="flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--muted)]">
            <PlugZap className="h-8 w-8 text-[var(--primary)] animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight">
            Integrations Coming Soon
          </h1>

          {/* Subtext */}
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            We’re working on bringing seamless integrations with your favorite
            tools. Stay tuned for powerful new connections that will make your
            workflow even smoother.
          </p>

          {/* Status */}
          <div className="flex items-center gap-2 text-[var(--primary)] font-medium">
            <Loader2 className="h-5 w-5 animate-spin" />
            In Progress
          </div>

          {/* Placeholder badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Slack", "Zapier", "Notion", "Google Drive", "GitHub"].map(
              (name) => (
                <span
                  key={name}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--muted)] text-[var(--muted-foreground)]"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer note */}
      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Have an integration in mind? Let us know!
      </p>
    </div>
  )
}
