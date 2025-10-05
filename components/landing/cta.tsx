"use client"

import { Button } from "@/components/ui/button"

export default function CtaCard() {
  return (
    <section className="w-full flex items-center justify-center py-20 px-6 bg-[var(--background)]">
      <div className="relative max-w-5xl w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-[var(--border)]">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-90" />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center text-center py-20 px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl leading-snug">
            Power your app with the <span className="text-[var(--primary-foreground)]">AskGuru AI</span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl">
            Trusted by modern teams to deliver instant, reliable AI-driven support & insights.
          </p>

          <Button
            size="lg"
            className="mt-8 px-6 py-3 text-base rounded-md bg-background text-white hover:opacity-90"
          >
            Get Started →
          </Button>
        </div>
      </div>
    </section>
  )
}
