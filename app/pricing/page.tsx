"use client";

import { useState } from "react";
import { PLANS, FREE_TIER } from "@/lib/products";
import { Marquee } from "@/components/marquee";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (planId: string) => {
    setLoading(planId);

    try {
      // Create order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const plan = PLANS.find((p) => p.id === planId);

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RoastMyCV",
        description: `${plan?.name} - Premium Access`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // Verify payment
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              durationMonths: plan?.durationMonths,
            }),
          });

          if (verifyRes.ok) {
            setSuccess(true);
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#FACC15",
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">&#127881;</div>
          <h1 className="text-4xl font-black text-foreground mb-2">
            PAYMENT SUCCESSFUL!
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to the premium squad. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="min-h-screen bg-background">
        <Marquee
          text="UNLOCK PREMIUM // GET ROASTED HARDER // DETAILED ANALYSIS // IMPROVEMENT TIPS //"
          className="bg-primary text-primary-foreground"
        />

        <div className="container mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-mono"
          >
            &larr; Back to roasting
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
              UPGRADE YOUR
              <br />
              <span className="text-primary">ROAST GAME</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Free roasts are cool, but premium roasts hit different. Get
              detailed analysis, personalized tips, and unlimited brutal
              honesty.
            </p>
          </div>

          {/* Free Tier */}
          <div className="max-w-md mx-auto mb-8">
            <div className="border-2 border-border bg-card p-6 shadow-brutal">
              <div className="text-center mb-4">
                <span className="text-sm font-mono text-muted-foreground">
                  FREE TIER
                </span>
                <h3 className="text-2xl font-black">Casual Roaster</h3>
                <p className="text-4xl font-black text-foreground mt-2">
                  ₹0
                  <span className="text-sm font-normal text-muted-foreground">
                    /forever
                  </span>
                </p>
              </div>
              <ul className="space-y-2 mb-6">
                {FREE_TIER.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <span className="text-destructive">&#10005;</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full text-center py-3 border-2 border-border font-bold hover:bg-muted transition-colors"
              >
                STAY FREE
              </Link>
            </div>
          </div>

          {/* Premium Plans */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-4 bg-card p-8 shadow-brutal-lg transition-transform hover:-translate-y-1 ${
                  plan.popular
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 font-black text-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <span className="text-sm font-mono text-muted-foreground uppercase">
                    {plan.id}
                  </span>
                  <h3 className="text-2xl font-black text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                  <p className="text-5xl font-black text-foreground mt-4">
                    {plan.displayPrice}
                    <span className="text-lg font-normal text-muted-foreground">
                      {plan.duration}
                    </span>
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-foreground"
                    >
                      <span className="text-accent">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan.id)}
                  disabled={loading !== null}
                  className={`w-full py-4 font-black text-lg transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed shadow-brutal active:translate-y-1 active:shadow-none`}
                >
                  {loading === plan.id ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-spin">&#9881;</span>
                      PROCESSING...
                    </span>
                  ) : (
                    `GET ${plan.name.toUpperCase()}`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Secured by Razorpay. Cancel anytime.
            </p>
            <div className="flex justify-center gap-8 text-muted-foreground">
              <span>&#128274; Secure Payment</span>
              <span>&#9889; Instant Access</span>
              <span>&#128172; 24/7 Support</span>
            </div>
          </div>
        </div>

        <Marquee
          text="NO CAP // WORTH EVERY RUPEE // SLAY YOUR CV // GET HIRED FASTER //"
          className="bg-accent text-accent-foreground"
          direction="right"
        />
      </div>
    </>
  );
}
