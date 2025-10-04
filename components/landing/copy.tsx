"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { RainbowButton } from "../ui/rainbow-button"



export function CopyCommand() {
  const [copied, setCopied] = useState(false)
  const command = 'npm i askguru';
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <RainbowButton
      onClick={handleCopy}
      variant="outline"
      className=" ml-3 mt-8 h-12 px-3 flex items-center gap-2 text-[var(--foreground)] hover:bg-[var(--muted)]"
    >
      <code className="text-sm font-mono text-[var(--foreground)]">
        {command}
      </code>
      {copied ? (
        <Check className="h-4 w-4 text-[var(--primary)]" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </RainbowButton>
  )
}
