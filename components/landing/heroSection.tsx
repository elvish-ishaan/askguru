"use client"

import { Button } from "@/components/ui/button"
import CopyCommand from "./copy"

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] w-full bg-[#020617] flex pt-32 justify-center text-center px-6">
      {/* Dark Sphere Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full mx-auto flex flex-col items-center ">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-noticia w-full">
          Make Your Website <span className="text-[var(--primary)] inline-block">Conversational</span>
        </h1>
        <p className=" mt-10 text-lg sm:text-xl text-slate-300 font-firaSans max-w-3xl">
          Transform how users interact with your brand through intelligent, engaging, and human-like conversations directly on your site.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 text-lg hover:opacity-90">
            Get Started
          </Button>
          <Button variant="outline" className="px-6 py-3 text-lg border-[var(--primary)] text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
            Learn More
          </Button>
        </div>
        <CopyCommand/>
      </div>
    </section>
  )
}
