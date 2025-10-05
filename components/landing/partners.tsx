"use client"

import { motion } from "framer-motion"
import { Cloud, Globe, Layers, Rocket, Star, Sun, Zap, Box } from "lucide-react"

const partners = [
  { name: "Nova", icon: Rocket },
  { name: "Orbit", icon: Globe },
  { name: "Nimbus", icon: Cloud },
  { name: "Vertex", icon: Layers },
  { name: "Prism", icon: Box },
  { name: "Atlas", icon: Globe },
  { name: "Stellar", icon: Star },
  { name: "Lumen", icon: Sun },
]

export default function PartnersScroller() {
  return (
    <div className=" py-4">
      <h1 className=" text-4xl font-bold text-center">Companies who trust</h1>
      <div className="relative w-full bg-[var(--background)] py-16 overflow-hidden">
      {/* Gradient fade left */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
      {/* Gradient fade right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

      {/* Scrolling container */}
      <motion.div
        className="flex gap-32 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {[...partners, ...partners].map((partner, idx) => {
          const Icon = partner.icon
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-2 text-[var(--muted-foreground)]"
            >
              <Icon className="h-10 w-10 text-[var(--foreground)]" />
              <span className="text-sm font-medium">{partner.name}</span>
            </div>
          )
        })}
      </motion.div>
    </div>
    </div>
  )
}
