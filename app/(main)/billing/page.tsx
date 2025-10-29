"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [session]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/current");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      });
      if (response.ok) {
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setReactivating(true);
    try {
      const response = await fetch("/api/subscriptions/reactivate", {
        method: "POST",
      });
      if (response.ok) {
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Error reactivating subscription:", error);
    } finally {
      setReactivating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "CANCELED":
        return "bg-gray-500";
      case "PAST_DUE":
        return "bg-red-500";
      case "TRIALING":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <p className="text-gray-400 mt-2">Manage your subscription and billing information</p>
      </div>

      {subscription ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Current Subscription</CardTitle>
              <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Plan</p>
              <p className="text-2xl font-bold">{subscription.plan}</p>
            </div>

            {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Current Period Start</p>
                  <p>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Period End</p>
                  <p>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {subscription.status === "ACTIVE" && (
              <div className="flex gap-2">
                {subscription.cancelAtPeriodEnd ? (
                  <Button onClick={handleReactivateSubscription} disabled={reactivating}>
                    {reactivating ? "Reactivating..." : "Reactivate Subscription"}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Cancel Subscription"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open("https://billing.stripe.com/p/login/test", "_blank");
                  }}
                >
                  Manage Billing
                </Button>
              </div>
            )}

            {subscription.status === "CANCELED" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm">
                  Your subscription has been canceled. You will continue to have access until the
                  end of your current billing period.
                </p>
              </div>
            )}

            {subscription.status === "PAST_DUE" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm">
                  Your payment failed. Please update your payment method to continue your
                  subscription.
                </p>
                <Button className="mt-2" variant="outline">
                  Update Payment Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              You don't have an active subscription. Upgrade to a paid plan to unlock more features.
            </p>
            <Button onClick={() => (window.location.href = "/pricing")}>View Plans</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Manage your payment methods and billing information in Stripe.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              window.open("https://billing.stripe.com/p/login/test", "_blank");
            }}
          >
            Manage Payment Methods
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
