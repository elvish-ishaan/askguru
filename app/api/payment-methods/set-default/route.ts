import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/dbClient";

export async function POST(request: NextRequest) {
  try {
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripeCustomerId =
      user.subscriptions[0]?.stripeCustomerId ||
      user.subscriptions.find((s) => s.stripeCustomerId)?.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "No customer found" }, { status: 404 });
    }

    // Update customer's default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Update all subscriptions to use this payment method
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.update(subscription.id, {
        default_payment_method: paymentMethodId,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting default payment method:", error);
    return NextResponse.json({ error: "Failed to set default payment method" }, { status: 500 });
  }
}
