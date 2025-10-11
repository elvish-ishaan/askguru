"use client"

import { Button } from "@/components/ui/button"
import  {CopyCommand} from "./copy"
import { Safari } from "../ui/safari"

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] w-full bg-primary flex pt-20 pb-5 justify-center text-center px-6">
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
      <div className=" flex flex-col">
        {/* Content */}
        <div className="relative z-10 w-full mx-auto flex flex-col items-center ">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-noticia w-full">
          Make Your Website <span className="text-[var(--primary)] inline-block">Conversational</span>
        </h1>
        <p className=" mt-6 text-lg sm:text-xl text-slate-300 font-numans max-w-3xl">
          Transform how users interact with your brand through intelligent, engaging, and human-like conversations directly on your site.
        </p>
        <CopyCommand/>

        {/* CTA Buttons */}
        <div className="my-8 flex flex-col sm:flex-row gap-4">
          <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 text-lg hover:opacity-90">
            Get Started
          </Button>
          <Button variant="outline" className="px-6 py-3 text-lg border-[var(--primary)] text-white hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
            Learn More
          </Button>
        </div>
        </div>
                {/* mock screeen */}
        <div className="w-[1203px]">
      <Safari
        url="www.askguru.ai"
        imageSrc="./askguru.png"
      />
        </div>
      </div>
    </section>
  )
}
