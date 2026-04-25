"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Flame, Zap, Github, Crown } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

import { Marquee, MarqueeReverse } from "@/components/marquee";
import { ToneSelector, Tone } from "@/components/tone-selector";
import { ResumeInput } from "@/components/resume-input";
import { RoastResult } from "@/components/roast-result";
import { SampleRoasts } from "@/components/sample-roasts";
import { Stats } from "@/components/stats";
import { Tips } from "@/components/tips";
import { PremiumBanner, RoastLimitWarning } from "@/components/premium-banner";
import { FREE_TIER } from "@/lib/products";

const ROAST_COUNT_KEY = "roastmycv_daily_count";
const ROAST_DATE_KEY = "roastmycv_daily_date";

function getRoastsUsedToday(): number {
  if (typeof window === "undefined") return 0;
  const savedDate = localStorage.getItem(ROAST_DATE_KEY);
  const today = new Date().toDateString();
  if (savedDate !== today) {
    localStorage.setItem(ROAST_DATE_KEY, today);
    localStorage.setItem(ROAST_COUNT_KEY, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(ROAST_COUNT_KEY) || "0", 10);
}

function incrementRoastCount(): number {
  const current = getRoastsUsedToday();
  const newCount = current + 1;
  localStorage.setItem(ROAST_COUNT_KEY, newCount.toString());
  return newCount;
}

export default function Home() {
  const [resume, setResume] = useState("");
  const [tone, setTone] = useState<Tone>("savage");
  const [hasRoasted, setHasRoasted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [roastsUsed, setRoastsUsed] = useState(0);

  useEffect(() => {
    // Check premium status
    fetch("/api/check-premium")
      .then((res) => res.json())
      .then((data) => setIsPremium(data.isPremium))
      .catch(() => {});

    // Get roasts used today
    setRoastsUsed(getRoastsUsedToday());
  }, []);

  const { messages, append, status, setMessages } = useChat({
    api: "/api/roast",
    body: { tone, isPremium },
  });

  const isLoading = status === "streaming" || status === "submitted";
  const roastContent = messages.find((m) => m.role === "assistant")?.content || "";

  const canRoast = isPremium || roastsUsed < FREE_TIER.roastsPerDay;

  const handleRoast = async () => {
    if (resume.trim().length < 50) {
      return;
    }

    if (!canRoast) {
      return;
    }

    // Increment roast count for free users
    if (!isPremium) {
      setRoastsUsed(incrementRoastCount());
    }

    setHasRoasted(true);
    setMessages([]);

    // Fire confetti on roast
    confetti({
      particleCount: isPremium ? 100 : 50,
      spread: isPremium ? 100 : 60,
      origin: { y: 0.7 },
      colors: ["#facc15", "#ec4899", "#06b6d4"],
    });

    await append({
      role: "user",
      content: resume,
    });

    // Increment stats
    fetch("/api/stats", { method: "POST" });
  };

  const handleRoastAgain = () => {
    setHasRoasted(false);
    setMessages([]);
    setResume("");
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Premium Banner */}
      {!isPremium && <PremiumBanner />}

      {/* Top Marquee */}
      <Marquee />

      {/* Header */}
      <header className="p-6 md:p-8 border-b-4 border-foreground">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-destructive p-3 brutal-border brutal-shadow-sm">
              <Flame className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                RoastMyCV
                {isPremium && (
                  <span className="bg-gradient-to-r from-primary to-accent text-xs px-2 py-1 font-bold">
                    PRO
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">brutally honest resume feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isPremium && (
              <Link
                href="/pricing"
                className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-bold brutal-border brutal-shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Crown className="h-4 w-4" />
                UPGRADE
              </Link>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 brutal-border brutal-shadow-sm brutal-shadow-hover bg-background hidden md:block"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="p-6 md:p-12 border-b-4 border-foreground bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-black leading-tight mb-4">
            YOUR{" "}
            <span className="bg-primary px-3 inline-block transform -rotate-1">RESUME</span>{" "}
            IS{" "}
            <span className="bg-accent text-accent-foreground px-3 inline-block transform rotate-1">TRASH</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            paste it. get roasted. fix it. land that job fr fr.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Input Section */}
            <div className="brutal-border brutal-shadow bg-background">
              <div className="bg-secondary p-3 border-b-4 border-foreground font-bold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                DROP YOUR RESUME
              </div>
              <div className="p-6">
                <ResumeInput value={resume} onChange={setResume} />
              </div>
            </div>

            {/* Tone Selector */}
            <div className="brutal-border brutal-shadow bg-background">
              <div className="bg-accent text-accent-foreground p-3 border-b-4 border-foreground font-bold">
                CHOOSE YOUR DAMAGE LEVEL
              </div>
              <div className="p-6">
                <ToneSelector selected={tone} onSelect={setTone} />
              </div>
            </div>

            {/* Roast Limit Warning for Free Users */}
            {!isPremium && (
              <RoastLimitWarning
                roastsUsed={roastsUsed}
                maxRoasts={FREE_TIER.roastsPerDay}
              />
            )}

            {/* Roast Button */}
            <button
              onClick={handleRoast}
              disabled={isLoading || resume.trim().length < 50 || !canRoast}
              className={`w-full py-5 text-xl font-black brutal-border brutal-shadow brutal-shadow-hover transition-all ${
                isLoading
                  ? "bg-muted cursor-not-allowed animate-pulse"
                  : !canRoast
                  ? "bg-muted cursor-not-allowed"
                  : resume.trim().length < 50
                  ? "bg-muted cursor-not-allowed"
                  : "bg-destructive hover:bg-destructive/90"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Flame className="h-6 w-6 animate-bounce" />
                  ROASTING IN PROGRESS...
                </span>
              ) : !canRoast ? (
                <span className="flex items-center justify-center gap-2">
                  DAILY LIMIT REACHED
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Flame className="h-6 w-6" />
                  {isPremium ? "PREMIUM ROAST" : "ROAST MY CV"}
                </span>
              )}
            </button>

            {/* Result */}
            {hasRoasted && (
              <RoastResult
                content={roastContent}
                isStreaming={isLoading}
                onRoastAgain={handleRoastAgain}
              />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Stats />
            <SampleRoasts />
            <Tips />
          </div>
        </div>
      </section>

      {/* Bottom Marquee */}
      <MarqueeReverse />

      {/* Footer */}
      <footer className="p-6 border-t-4 border-foreground bg-foreground text-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold">
            made with unhinged energy by the RoastMyCV team
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
