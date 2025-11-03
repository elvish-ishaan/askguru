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

    // Get customer to check if this is the default payment method
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    const isDefault =
      customer &&
      !customer.deleted &&
      customer.invoice_settings?.default_payment_method === paymentMethodId;

    if (isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default payment method. Set another as default first." },
        { status: 400 },
      );
    }

    // Detach payment method
    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json({ error: "Failed to delete payment method" }, { status: 500 });
  }
}
