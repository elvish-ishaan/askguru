import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  FREE: "free", // No Stripe price ID for free tier
  GROWTH_MONTHLY_USD: process.env.STRIPE_GROWTH_MONTHLY_USD_PRICE_ID || "",
  PRO_MONTHLY_USD: process.env.STRIPE_PRO_MONTHLY_USD_PRICE_ID || "",
  ENTERPRISE: "enterprise", // Custom pricing, no Stripe price ID
} as const;

export const PLAN_TIER_TO_PRICE_ID = {
  FREE: null,
  GROWTH: STRIPE_PRICE_IDS.GROWTH_MONTHLY_USD,
  PRO: STRIPE_PRICE_IDS.PRO_MONTHLY_USD,
  ENTERPRISE: null,
} as const;

export type PlanTier = "FREE" | "GROWTH" | "PRO" | "ENTERPRISE";

export function convertStripeStatusToSubscriptionStatus(
  stripeStatus: string,
):
  | "ACTIVE"
  | "CANCELED"
  | "PAST_DUE"
  | "UNPAID"
  | "TRIALING"
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED" {
  const statusMap: Record<
    string,
    "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING" | "INCOMPLETE" | "INCOMPLETE_EXPIRED"
  > = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    unpaid: "UNPAID",
    trialing: "TRIALING",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
  };

  return statusMap[stripeStatus.toLowerCase()] || "ACTIVE";
}

export function getPlanTierFromStripePriceId(priceId: string): PlanTier | null {
  if (priceId === STRIPE_PRICE_IDS.GROWTH_MONTHLY_USD) return "GROWTH";
  if (priceId === STRIPE_PRICE_IDS.PRO_MONTHLY_USD) return "PRO";
  return null;
}
