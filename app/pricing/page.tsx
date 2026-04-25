"use client";

import { useState } from "react";
import { PLANS, FREE_TIER } from "@/lib/products";
import { Marquee } from "@/components/marquee";
import Link from "next/link";
import { Flame, Crown, Zap, Shield, Clock, MessageCircle, Loader2 } from "lucide-react";

type PaymentMethod = "instamojo" | "razorpay";

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
  const [showForm, setShowForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("instamojo");

  const handleInstamojo = async (planId: string) => {
    if (!formData.name || !formData.email) {
      alert("Please fill in your name and email");
      return;
    }

    setLoading(planId);

    try {
      const res = await fetch("/api/instamojo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || "Failed to create payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setLoading(null);
    }
  };

  const handleRazorpay = async (planId: string) => {
    setLoading(planId);

    try {
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

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RoastMyCV",
        description: `${plan?.name} - Premium Access`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
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
            window.location.href = "/payment/success?payment_status=success";
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
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

  const handlePayment = async (planId: string) => {
    if (paymentMethod === "instamojo") {
      await handleInstamojo(planId);
    } else {
      await handleRazorpay(planId);
    }
  };

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
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-mono brutal-border brutal-shadow-sm px-4 py-2 bg-card"
          >
            &larr; Back to roasting
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 brutal-border mb-6">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-bold">JOIN 10K+ PRO ROASTERS</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 text-balance">
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
          <div className="max-w-md mx-auto mb-12">
            <div className="brutal-border brutal-shadow bg-card p-6">
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
                    <span className="text-muted-foreground">-</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full text-center py-3 brutal-border font-bold hover:bg-muted transition-colors"
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
                className={`relative brutal-border bg-card p-8 transition-transform hover:-translate-y-1 ${
                  plan.popular
                    ? "border-primary bg-primary/5 brutal-shadow-lg"
                    : "brutal-shadow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 font-black text-sm brutal-border">
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
                  {plan.savings && (
                    <span className="inline-block mt-2 bg-accent text-accent-foreground text-sm font-bold px-3 py-1">
                      {plan.savings}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-foreground"
                    >
                      <span className="text-accent font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {showForm === plan.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-3 brutal-border bg-background font-mono"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-3 brutal-border bg-background font-mono"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-3 brutal-border bg-background font-mono"
                    />
                    
                    {/* Payment Method Selector */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPaymentMethod("instamojo")}
                        className={`flex-1 p-3 brutal-border font-bold text-sm transition-colors ${
                          paymentMethod === "instamojo"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        Instamojo
                      </button>
                      <button
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`flex-1 p-3 brutal-border font-bold text-sm transition-colors ${
                          paymentMethod === "razorpay"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        Razorpay
                      </button>
                    </div>

                    <button
                      onClick={() => handlePayment(plan.id)}
                      disabled={loading !== null}
                      className="w-full py-4 bg-destructive text-destructive-foreground font-black text-lg brutal-border brutal-shadow brutal-shadow-hover disabled:opacity-50"
                    >
                      {loading === plan.id ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          PROCESSING...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          PAY {plan.displayPrice}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setShowForm(null)}
                      className="w-full py-2 text-muted-foreground text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm(plan.id)}
                    className={`w-full py-4 font-black text-lg transition-all brutal-border brutal-shadow brutal-shadow-hover ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Flame className="h-5 w-5" />
                      GET {plan.name.toUpperCase()}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Secure Payment
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Instant Access
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Cancel Anytime
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                24/7 Support
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secured by Instamojo & Razorpay. Your payment details are safe.
            </p>
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
