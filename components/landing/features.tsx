"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, KeyRound, BarChart3, Shield, Settings, Plug } from "lucide-react"

const features = [
  {
    title: "Conversational AI",
    description: "Turn your website into a conversational experience powered by AskGuru’s AI assistant.",
    icon: Bot,
  },
  {
    title: "API Key Management",
    description: "Securely generate and manage API keys for your projects with ease.",
    icon: KeyRound,
  },
  {
    title: "Analytics & Usage",
    description: "Track usage, monitor requests, and gain insights into your AI-powered interactions.",
    icon: BarChart3,
  },
  {
    title: "Enterprise Security",
    description: "Built-in authentication, secure data handling, and strict privacy by design.",
    icon: Shield,
  },
  {
    title: "Flexible Settings",
    description: "Customize behavior, fine-tune responses, and adapt AskGuru to your needs.",
    icon: Settings,
  },
  {
    title: "Seamless Integrations",
    description: "Easily integrate with existing platforms, tools, and workflows.",
    icon: Plug,
  },
]

export default function Features() {
  return (
    <section className=" relative w-full py-20 bg-background text-foreground">
         {/* <LightRays color="rgba(23, 106, 186, 0.79)" count={4} speed={5} /> */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose <span className=" text-primary text-5xl">AskGuru</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Discover the powerful features that make AskGuru the best solution for creating conversational websites.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-shadow duration-300 border border-[var(--border)] bg-card"
            >
              <CardHeader>
                <feature.icon className="w-10 h-10 text-[var(--primary)] mb-4" />
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
