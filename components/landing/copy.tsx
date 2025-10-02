"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CopyCommand() {
  const [copied, setCopied] = useState(false)
  const command = "npm i askguru"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="w-full flex items-center justify-center px-2 my-8">
      <div className="flex max-w-xl items-center justify-between rounded-lg bg-secondary border  px-4 py-3 shadow-sm">
        <code className="text-sm font-mono text-[var(--foreground)]">
          {command}
        </code>
        <Button
          onClick={handleCopy}
          size="icon"
          variant="ghost"
          className="ml-3 h-8 w-8 text-[var(--foreground)] hover:bg-[var(--muted)]"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[var(--primary)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
