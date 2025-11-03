import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/dbClient";

export async function GET() {
  try {
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          // Check all subscriptions, not just active ones, since payment methods are tied to customer
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stripeCustomerId =
      user.subscriptions[0]?.stripeCustomerId ||
      user.subscriptions.find((s) => s.stripeCustomerId)?.stripeCustomerId;

    // If no customer ID in subscriptions, try to find by email in Stripe
    if (!stripeCustomerId) {
      try {
        const customers = await stripe.customers.list({
          email: session.user.email,
          limit: 1,
        });

        if (customers.data.length > 0) {
          stripeCustomerId = customers.data[0].id;
        }
      } catch (error) {
        console.error("Error searching for Stripe customer by email:", error);
      }
    }

    if (!stripeCustomerId) {
      return NextResponse.json({ paymentMethods: [], defaultPaymentMethod: null });
    }

    // Get all payment methods (cards and other types like Amazon Pay, etc.)
    const allPaymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
    });

    // Filter for cards and other supported payment methods
    const paymentMethods = allPaymentMethods.data.filter(
      (pm) => pm.type === "card" || pm.type === "amazon_pay" || pm.type === "paypal",
    );

    // Get customer to find default payment method
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    const defaultPaymentMethodId =
      customer && !customer.deleted
        ? (customer.invoice_settings?.default_payment_method as string | null) || null
        : null;

    const formattedPaymentMethods = paymentMethods.map((pm) => ({
      id: pm.id,
      type: pm.type,
      card: pm.card
        ? {
            brand: pm.card.brand,
            last4: pm.card.last4,
            expMonth: pm.card.exp_month,
            expYear: pm.card.exp_year,
          }
        : null,
      // For non-card payment methods, include a display name
      billingDetails: pm.billing_details || null,
      isDefault: pm.id === defaultPaymentMethodId,
      created: pm.created,
    }));

    return NextResponse.json({
      paymentMethods: formattedPaymentMethods,
      defaultPaymentMethod: defaultPaymentMethodId,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
  }
}
