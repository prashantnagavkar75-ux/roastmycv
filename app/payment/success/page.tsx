"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Flame, Crown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  
  const paymentId = searchParams.get("payment_id");
  const paymentStatus = searchParams.get("payment_status");

  useEffect(() => {
    if (paymentStatus === "Credit" || paymentStatus === "success") {
      setStatus("success");
      
      // Save premium status
      localStorage.setItem("roastmycv_premium", "true");
      localStorage.setItem("roastmycv_premium_date", new Date().toISOString());
      
      // Celebration confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#facc15", "#ec4899", "#06b6d4"],
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#facc15", "#ec4899", "#06b6d4"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else if (paymentStatus === "Failed") {
      setStatus("failed");
    } else {
      // Check URL params for Instamojo redirect
      setTimeout(() => {
        if (paymentId) {
          setStatus("success");
          localStorage.setItem("roastmycv_premium", "true");
          localStorage.setItem("roastmycv_premium_date", new Date().toISOString());
        } else {
          setStatus("failed");
        }
      }, 1500);
    }
  }, [paymentId, paymentStatus]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === "loading" && (
          <div className="text-center brutal-border brutal-shadow bg-card p-8">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
            <h1 className="text-2xl font-black mt-6">VERIFYING PAYMENT...</h1>
            <p className="text-muted-foreground mt-2">Hold tight bestie</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center brutal-border brutal-shadow bg-card p-8">
            <div className="relative inline-block">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
              <Crown className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-bounce" />
            </div>
            
            <h1 className="text-3xl font-black mt-6 text-balance">
              WELCOME TO THE PRO SQUAD
            </h1>
            
            <div className="mt-4 p-4 bg-primary/10 brutal-border">
              <p className="font-bold flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                You now have UNLIMITED roasts
                <Sparkles className="h-5 w-5 text-primary" />
              </p>
            </div>

            <ul className="mt-6 text-left space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Unlimited brutal roasts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Resume score & breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>ATS keyword suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Rewrite suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>30-day action plan</span>
              </li>
            </ul>

            <Link
              href="/"
              className="mt-8 w-full py-4 bg-destructive text-destructive-foreground font-black brutal-border brutal-shadow brutal-shadow-hover flex items-center justify-center gap-2 inline-block"
            >
              <Flame className="h-5 w-5" />
              START ROASTING
            </Link>

            {paymentId && (
              <p className="mt-4 text-xs text-muted-foreground">
                Payment ID: {paymentId}
              </p>
            )}
          </div>
        )}

        {status === "failed" && (
          <div className="text-center brutal-border brutal-shadow bg-card p-8">
            <XCircle className="h-20 w-20 text-destructive mx-auto" />
            
            <h1 className="text-3xl font-black mt-6">PAYMENT FAILED</h1>
            <p className="text-muted-foreground mt-2">
              No worries, these things happen
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/pricing"
                className="w-full py-4 bg-primary text-primary-foreground font-black brutal-border brutal-shadow brutal-shadow-hover flex items-center justify-center gap-2"
              >
                TRY AGAIN
              </Link>
              
              <Link
                href="/"
                className="w-full py-4 bg-card font-bold brutal-border brutal-shadow-sm flex items-center justify-center gap-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
