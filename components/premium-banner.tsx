"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

interface PremiumStatus {
  isPremium: boolean;
  daysRemaining?: number;
  expiryDate?: string;
}

export function PremiumBanner() {
  const [status, setStatus] = useState<PremiumStatus>({ isPremium: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/check-premium")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (status.isPremium) {
    return (
      <div className="bg-gradient-to-r from-primary via-accent to-primary p-3 border-b-4 border-foreground">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm font-bold">
          <Crown className="h-5 w-5" />
          <span>
            PREMIUM MEMBER - {status.daysRemaining} days remaining
          </span>
          <Crown className="h-5 w-5" />
        </div>
      </div>
    );
  }

  return (
    <Link href="/pricing" className="block">
      <div className="bg-gradient-to-r from-destructive via-primary to-accent p-3 border-b-4 border-foreground hover:from-accent hover:via-primary hover:to-destructive transition-all cursor-pointer">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm font-bold">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span>
            UNLOCK PREMIUM - Unlimited roasts + detailed analysis from just
            ₹49/month
          </span>
          <span className="bg-background text-foreground px-2 py-0.5 text-xs">
            CLICK HERE
          </span>
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
      </div>
    </Link>
  );
}

export function RoastLimitWarning({
  roastsUsed,
  maxRoasts,
}: {
  roastsUsed: number;
  maxRoasts: number;
}) {
  const remaining = maxRoasts - roastsUsed;

  if (remaining <= 0) {
    return (
      <div className="brutal-border bg-destructive/20 p-4 text-center">
        <p className="font-bold text-destructive">
          Daily limit reached! Upgrade to premium for unlimited roasts.
        </p>
        <Link
          href="/pricing"
          className="inline-block mt-2 bg-primary text-primary-foreground px-4 py-2 font-bold brutal-border brutal-shadow-sm hover:bg-primary/90"
        >
          UPGRADE NOW - ₹49/month
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center text-sm text-muted-foreground mb-2">
      <span className="font-bold text-foreground">{remaining}</span> free roasts
      remaining today.{" "}
      <Link href="/pricing" className="text-primary hover:underline font-bold">
        Go unlimited
      </Link>
    </div>
  );
}
