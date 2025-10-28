import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  stripe,
  convertStripeStatusToSubscriptionStatus,
  getPlanTierFromStripePriceId,
} from "@/lib/stripe";
import prisma from "@/prisma/dbClient";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const subscriptionObj = event.data.object as Stripe.Subscription;

  type SubscriptionPeriods = {
    current_period_start?: number;
    current_period_end?: number;
  };

  type InvoiceWithSubscription = Stripe.Invoice & {
    subscription?: string | { id: string } | null;
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const metadata = session.metadata;
        if (!metadata?.userId || !metadata?.planTier) {
          console.error("Missing metadata in checkout session");
          break;
        }

        // Create or update subscription
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: session.subscription as string },
          create: {
            userId: metadata.userId,
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
            stripePriceId: metadata.priceId,
            plan:
              metadata.planTier === "GROWTH" ||
              metadata.planTier === "PRO" ||
              metadata.planTier === "FREE" ||
              metadata.planTier === "ENTERPRISE"
                ? (metadata.planTier as "GROWTH" | "PRO" | "FREE" | "ENTERPRISE")
                : undefined,
            status: "ACTIVE",
            currentPeriodStart: new Date(session.created * 1000),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approximate
          },
          update: {
            status: "ACTIVE",
            updated_at: new Date(),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const s = subscriptionObj as Stripe.Subscription & SubscriptionPeriods;
        const priceId = s.items.data[0]?.price.id as string | undefined;
        const planTier = priceId ? getPlanTierFromStripePriceId(priceId) : null;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionObj.id },
          data: {
            status: convertStripeStatusToSubscriptionStatus(subscriptionObj.status),
            plan: planTier || undefined,
            stripePriceId: priceId,
            currentPeriodStart: s.current_period_start
              ? new Date(s.current_period_start * 1000)
              : undefined,
            currentPeriodEnd: s.current_period_end
              ? new Date(s.current_period_end * 1000)
              : undefined,
            cancelAtPeriodEnd: subscriptionObj.cancel_at_period_end,
            updated_at: new Date(),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionObj.id },
          data: {
            status: "CANCELED",
            updated_at: new Date(),
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as InvoiceWithSubscription;
        const invoiceSubId =
          typeof invoice.subscription === "string"
            ? (invoice.subscription as string)
            : invoice.subscription?.id;
        if (invoiceSubId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoiceSubId },
            data: {
              status: "ACTIVE",
              updated_at: new Date(),
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as InvoiceWithSubscription;
        const invoiceSubId =
          typeof invoice.subscription === "string"
            ? (invoice.subscription as string)
            : invoice.subscription?.id;
        if (invoiceSubId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoiceSubId },
            data: {
              status: "PAST_DUE",
              updated_at: new Date(),
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
