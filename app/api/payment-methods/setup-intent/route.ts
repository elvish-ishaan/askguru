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

    let stripeCustomerId = user.subscriptions[0]?.stripeCustomerId;

    // Create customer if doesn't exist
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = stripeCustomer.id;
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId,
    });
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return NextResponse.json({ error: "Failed to create setup intent" }, { status: 500 });
  }
}
