"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

export default function PricingPage() {
  const [currency, setCurrency] = useState<"usd" | "inr">("usd")
  const [annual, setAnnual] = useState(false)

  const formatPrice = (usd: number, inr: number, lifetime?: boolean) => {
    const price = currency === "usd" ? usd : inr
    return lifetime
      ? `${currency === "usd" ? "$" : "₹"}${price.toLocaleString()} lifetime`
      : `${currency === "usd" ? "$" : "₹"}${price.toLocaleString()} ${
          annual ? "/yr" : "/mo"
        }`
  }

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for individuals getting started",
      price: { usd: 15, inr: 1200 },
      credits: "50 credits / month",
      features: [
        "50 monthly credits",
        "Basic templates",
        "Standard integrations",
        "Email support",
      ],
    },
    {
      name: "Pro",
      desc: "Designed for fast-moving teams working in real time",
      price: { usd: 29, inr: 2400 },
      credits: "100 credits / month",
      features: [
        "Everything in Starter",
        "150 monthly credits",
        "5 daily credits (up to 150/mo)",
        "Private projects",
      ],
      highlight: true,
    },
    {
      name: "Business",
      desc: "Advanced controls and features for growing departments",
      price: { usd: 59, inr: 4800 },
      credits: "300 credits / month",
      features: [
        "Everything in Pro",
        "300 monthly credits",
        "SSO & org workspaces",
        "Personal projects",
      ],
    },
    {
      name: "Co-founder",
      desc: "Built for orgs needing scale, governance & support",
      price: { usd: 999, inr: 80000 },
      credits: "Lifetime access",
      features: [
        "Lifetime access to all features",
        "Unlimited AI generations",
        "All future packs",
        "Direct founder support",
        "VIP community access",
        "Priority early access",
      ],
      lifetime: true,
      slotsLeft: 8,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-background text-foreground py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Pricing</h1>
          <p className="text-muted-foreground">
            Start for free. Upgrade to match your team’s needs.
          </p>

          {/* Currency toggle */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant={currency === "usd" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency("usd")}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
            >
              USD ($)
            </Button>
            <Button
              variant={currency === "inr" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency("inr")}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
            >
              INR (₹)
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col border rounded-2xl shadow-md bg-card",
                plan.highlight && "border-[var(--primary)] relative"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  {plan.name}
                  {plan.highlight && (
                    <Badge className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                      Most Popular
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold">
                    {formatPrice(
                      plan.price.usd,
                      plan.price.inr,
                      plan.lifetime
                    )}
                  </span>
                  {!plan.lifetime && (
                    <div className="flex items-center gap-2 mt-1">
                      <Switch
                        checked={annual}
                        onCheckedChange={setAnnual}
                        id={`${plan.name}-annual`}
                      />
                      <label
                        htmlFor={`${plan.name}-annual`}
                        className="text-sm text-muted-foreground"
                      >
                        Annual
                      </label>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className={cn(
                    "mb-6",
                    plan.highlight
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                      : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                  )}
                >
                  {plan.lifetime ? "Book a Demo" : "Get Started"}
                </Button>

                {/* Credits */}
                <p className="text-xs text-muted-foreground mb-4">
                  {plan.credits}
                </p>

                {/* Features */}
                <ul className="text-sm space-y-2 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                {/* Slots left (for Co-founder) */}
                {plan.slotsLeft && (
                  <div className="mt-4 flex items-center gap-2 text-red-500 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    {plan.slotsLeft} slots left
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
