"use client"

import {
  Cloud,
  Database,
  Code2,
  Cpu,
  Globe,
  Rocket,
  Shield,
} from "lucide-react"
import { Marquee } from "../ui/marquee"

const partners = [
  { name: "CloudPulse", icon: Cloud },
  { name: "DataFlux", icon: Database },
  { name: "DevMetrics", icon: Code2 },
  { name: "InnovaAI", icon: Cpu },
  { name: "GlobalNet", icon: Globe },
  { name: "Launchify", icon: Rocket },
  { name: "SecureSys", icon: Shield },
]

export default function PartnersMarquee() {
  return (
    <section className="w-full py-12 bg-slate-900/10 text-foreground overflow-hidden">
      <h3 className="text-center text-2xl font-semibold mb-8">
        Trusted by forward-thinking companies
      </h3>

      <Marquee
        className="w-full flex items-center gap-16 px-4"
        pauseOnHover
      >
        {partners.map((p) => {
          const Icon = p.icon
          return (
            <div
              key={p.name}
              className="flex flex-col items-center justify-center space-y-2 min-w-[140px]"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-[var(--muted)] shadow-md">
                <Icon className="h-8 w-8 text-[var(--foreground)]" />
              </div>
              <span className="text-sm font-medium">{p.name}</span>
            </div>
          )
        })}
      </Marquee>
    </section>
  )
}
