"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"usd" | "inr">("usd");
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = async (planName: string, stripePriceId?: string) => {
    if (planName === "Free") {
      router.push("/projects");
      return;
    }

    if (planName === "Enterprise") {
      // Handle enterprise custom pricing
      window.location.href = "mailto:sales@example.com";
      return;
    }

    if (!session) {
      router.push("/auth");
      return;
    }

    if (!stripePriceId) {
      console.error("No Stripe price ID for plan:", planName);
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          planTier: planName.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(null);
    }
  };

  // curreny toggle
  // const handleCurrencyChange = (checked: boolean) => {
  //   setCurrency(checked ? "inr" : "usd");
  // };

  const formatPrice = (
    usd: number | string,
    inr: number | string,
    lifetime?: boolean,
    name?: string,
  ) => {
    if (name === "Enterprise") return "Custom";

    const price = currency === "usd" ? usd : inr;
    const symbol = currency === "usd" ? "$" : "₹";

    return lifetime
      ? `${symbol}${price.toLocaleString()} lifetime`
      : `${symbol}${price.toLocaleString()} ${annual ? "/yr" : "/mo"}`;
  };

  const plans = [
    {
      name: "Free",
      desc: "Ideal for personal blogs, small landing pages, and testing the core functionality.",
      price: { usd: 0, inr: 0 },
      credits: "100 interactions / month",
      features: [
        "100 interactions/month",
        "1 Website Domain",
        "Up to 50 indexed pages (or 5MB of content)",
        "Basic chat widget",
        "Standard integrations",
        "Email support",
        "Weekly usage reports",
      ],
      stripePriceId: undefined,
    },
    {
      name: "Growth",
      desc: "For SMBs, e-commerce stores, and active blogs needing consistent, branded support.",
      price: { usd: 49, inr: 4260 },
      credits: "2,000 interactions/month",
      features: [
        "2,000 interactions/month",
        "5 Website Domains",
        "Up to 500 indexed pages (or 50MB of content)",
        "Custom branding",
        "Advanced Analytics",
        "Basic CRM/Email integration",
      ],
      highlight: true,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY_USD_PRICE_ID,
    },
    {
      name: "Pro",
      desc: "SaaS, large documentation sites, & businesses with high user traffic & specific support.",
      price: { usd: 199, inr: 17313 },
      credits: "10,000 interactions/month",
      features: [
        "10,000 interactions/month",
        "10 Website Domains",
        "Unlimited indexed pages",
        "API Access",
        "Priority chat support",
        "User access control",
        "Multiple Languages",
      ],
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_USD_PRICE_ID,
    },
    {
      name: "Enterprise",
      desc: "For large, regulated industries needing top-tier scale & security.",
      price: { usd: "Custom", inr: "Custom" },
      credits: "Custom/Very High Volume (e.g., 50,000+ interactions/month)",
      features: [
        "Unlimited Domains",
        "Content sources",
        "Service Level Agreement",
        "Dedicated Infrastructure",
        "Single Sign-On",
        "Custom AI model training/fine-tuning",
        "Dedicated Account Manager",
        "Compliance features (HIPAA, GDPR, SOC 2)",
      ],
      lifetime: true,
      slotsLeft: 8,
      stripePriceId: undefined,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3">Pricing Plans</h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Start for free and scale with your team’s needs.
          </p>

          {/* Currency toggle */}
          {/* <div className="mt-6 flex justify-center gap-4">
            <Switch
              id="currency-switch"
              checked={currency === "inr"}
              onCheckedChange={handleCurrencyChange}
            />
            <Label htmlFor="currency-switch" className="mr-2">
              {currency === "usd" ? "USD ($)" : "INR (₹)"}
            </Label>
          </div> */}
        </div>

        {/* Pricing grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300",
                plan.highlight && "border-gradient-r from-purple-500 to-pink-500 relative",
              )}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-xl md:text-2xl font-semibold">
                  {plan.name}
                  {plan.highlight && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                      Most Popular
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-gray-300 text-sm mt-1">{plan.desc}</p>
              </CardHeader>

              <CardContent className="flex flex-col flex-1">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {formatPrice(plan.price.usd, plan.price.inr, plan.lifetime, plan.name)}
                  </span>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handleCheckout(plan.name, plan.stripePriceId)}
                  disabled={loading === plan.name}
                  className={cn(
                    "mb-6 rounded-full py-3 text-base font-medium shadow-lg",
                    plan.highlight
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                      : "bg-white text-black hover:opacity-95",
                  )}
                >
                  {loading === plan.name
                    ? "Loading..."
                    : plan.name === "Enterprise"
                    ? "Book a Demo"
                    : "Get Started"}
                </Button>

                {/* Features */}
                <ul className="text-gray-300 text-sm space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-purple-400">•</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Slots left */}
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
  );
}
