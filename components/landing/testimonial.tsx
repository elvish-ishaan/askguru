"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Williams",
    role: "Product Manager, Nova",
    quote:
      "Askguru transformed how our team accesses knowledge. The integration was seamless, and the results have been phenomenal.",
  },
  {
    name: "James Miller",
    role: "CTO, Orbit",
    quote:
      "The developer experience with Askguru is outstanding. Clean APIs, great documentation, and reliable performance.",
  },
  {
    name: "Emily Davis",
    role: "Founder, Prism",
    quote:
      "We scaled faster than ever thanks to Askguru’s automation and AI-driven insights. It’s a real game-changer.",
  },
]

export default function Testimonials() {
  return (
    <section className="relative w-full bg-[var(--background)] py-20">
      <div className="mx-auto max-w-5xl text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-lg text-[var(--muted-foreground)]">
          Hear directly from teams who are using Askguru to power their projects.
        </p>
      </div>

      <div className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-6">
        {testimonials.map((t, idx) => (
          <Card
            key={idx}
            className="bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition"
          >
            <CardHeader className="flex flex-row items-start gap-2">
              <Quote className="h-6 w-6 text-[var(--primary)]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[var(--foreground)] text-base leading-relaxed">
                “{t.quote}”
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Avatar>
                  <AvatarFallback>
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
