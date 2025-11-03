"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, CreditCard, Trash2, Plus, Check } from "lucide-react";

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

interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  billingDetails?: {
    name?: string | null;
    email?: string | null;
  } | null;
  isDefault: boolean;
  created: number;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [addingPaymentMethod, setAddingPaymentMethod] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);
  const [openingBillingPortal, setOpeningBillingPortal] = useState(false);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/current");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        // No subscription found
        setSubscription(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const pollSubscriptionWithRetries = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const success = await fetchSubscription();
      if (success) {
        break;
      }
    }
  };

  const fetchPaymentMethods = async () => {
    setPaymentMethodsLoading(true);
    try {
      const response = await fetch("/api/payment-methods");
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    fetchPaymentMethods();

    // Check for subscription success query parameter (client-side only)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionSuccess = urlParams.get("subscription_success");
      const sessionId = urlParams.get("session_id");

      if (subscriptionSuccess === "true" || sessionId) {
        setShowSuccessMessage(true);
        // Poll for subscription with retries (webhook might be delayed)
        pollSubscriptionWithRetries();
        // Clean up URL
        router.replace("/billing");
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }

      // Refresh payment methods after returning from Stripe checkout or billing portal
      const paymentMethodAdded = urlParams.get("payment_method_added");
      const refreshPaymentMethods = urlParams.get("refresh_payment_methods");
      if (paymentMethodAdded === "true" || refreshPaymentMethods === "true") {
        setTimeout(() => {
          fetchPaymentMethods();
          // Clean up URL after refresh
          const cleanUrl = window.location.pathname;
          router.replace(cleanUrl);
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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

  const handleAddPaymentMethod = async () => {
    setAddingPaymentMethod(true);
    try {
      // Redirect to Stripe billing portal for adding payment methods
      window.location.href = `/api/payment-methods/billing-portal`;
    } catch (error) {
      console.error("Error adding payment method:", error);
      setAddingPaymentMethod(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setSettingDefault(paymentMethodId);
    try {
      const response = await fetch("/api/payment-methods/set-default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (response.ok) {
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error("Error setting default payment method:", error);
    } finally {
      setSettingDefault(null);
    }
  };

  const handleDeleteClick = (paymentMethodId: string) => {
    setPaymentMethodToDelete(paymentMethodId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!paymentMethodToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch("/api/payment-methods/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethodId: paymentMethodToDelete }),
      });

      if (response.ok) {
        await fetchPaymentMethods();
        setDeleteDialogOpen(false);
        setPaymentMethodToDelete(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete payment method");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      alert("Failed to delete payment method");
    } finally {
      setDeleting(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  const handleManageBilling = async () => {
    setOpeningBillingPortal(true);
    try {
      // Redirect to Stripe billing portal
      window.location.href = `/api/subscriptions/billing-portal`;
    } catch (error) {
      console.error("Error opening billing portal:", error);
      setOpeningBillingPortal(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    // Redirect to payment methods billing portal or general billing portal
    window.location.href = `/api/payment-methods/billing-portal`;
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

      {showSuccessMessage && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  Subscription Activated!
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Your subscription has been successfully activated. Welcome to your new plan!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  onClick={handleManageBilling}
                  disabled={openingBillingPortal}
                >
                  {openingBillingPortal ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    "Manage Billing"
                  )}
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
                <Button className="mt-2" variant="outline" onClick={handleUpdatePaymentMethod}>
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
              You don&apos;t have an active subscription. Upgrade to a paid plan to unlock more
              features.
            </p>
            <Button onClick={() => (window.location.href = "/pricing")}>View Plans</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Methods</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageBilling}
                disabled={openingBillingPortal}
              >
                {openingBillingPortal ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Opening...
                  </>
                ) : (
                  "Manage Billing"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPaymentMethod}
                disabled={addingPaymentMethod}
              >
                {addingPaymentMethod ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethodsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-4">No payment methods on file</p>
              <Button
                variant="outline"
                onClick={handleAddPaymentMethod}
                disabled={addingPaymentMethod}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {pm.card
                            ? `${getCardBrandIcon(pm.card.brand)} •••• ${pm.card.last4}`
                            : pm.type === "amazon_pay"
                            ? "Amazon Pay"
                            : pm.type === "paypal"
                            ? "PayPal"
                            : pm.billingDetails?.name || "Payment Method"}
                        </p>
                        {pm.isDefault && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                          >
                            Default
                          </Badge>
                        )}
                      </div>
                      {pm.card && (
                        <p className="text-sm text-gray-500">
                          Expires {pm.card.expMonth.toString().padStart(2, "0")}/{pm.card.expYear}
                        </p>
                      )}
                      {!pm.card && pm.billingDetails?.email && (
                        <p className="text-sm text-gray-500">{pm.billingDetails.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(pm.id)}
                        disabled={settingDefault === pm.id}
                      >
                        {settingDefault === pm.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Set Default
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(pm.id)}
                      disabled={deleting || pm.isDefault}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
