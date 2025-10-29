import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/dbClient";

export async function GET(request: NextRequest) {
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
      // Create customer if doesn't exist
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: user.id,
        },
      });

      const billingPortal = await stripe.billingPortal.sessions.create({
        customer: stripeCustomer.id,
        return_url: `${request.nextUrl.origin}/billing?payment_method_added=true`,
      });

      return NextResponse.redirect(billingPortal.url);
    }

    const billingPortal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${request.nextUrl.origin}/billing?payment_method_added=true`,
    });

    return NextResponse.redirect(billingPortal.url);
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 });
  }
}
