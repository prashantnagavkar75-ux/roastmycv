"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Flame, AlertTriangle, Sparkles, Target } from "lucide-react";

interface RoastScoreProps {
  content: string;
  isVisible: boolean;
}

interface ScoreData {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    icon: React.ElementType;
    color: string;
  }[];
  verdict: string;
}

function analyzeContent(content: string): ScoreData {
  const lowerContent = content.toLowerCase();
  
  // Count red flags mentioned
  const redFlagKeywords = ["red flag", "issue", "problem", "lacks", "missing", "weak", "vague", "generic", "buzzword"];
  const redFlagCount = redFlagKeywords.reduce(
    (count, keyword) => count + (lowerContent.match(new RegExp(keyword, "g"))?.length || 0),
    0
  );

  // Count positive mentions
  const positiveKeywords = ["good", "strong", "impressive", "solid", "excellent", "great"];
  const positiveCount = positiveKeywords.reduce(
    (count, keyword) => count + (lowerContent.match(new RegExp(keyword, "g"))?.length || 0),
    0
  );

  // Calculate scores
  const clarityScore = Math.max(20, Math.min(100, 70 - redFlagCount * 5 + positiveCount * 3));
  const impactScore = Math.max(15, Math.min(100, 60 - redFlagCount * 4 + positiveCount * 4));
  const readabilityScore = Math.max(25, Math.min(100, 75 - redFlagCount * 3));
  const hiringPotential = Math.max(10, Math.min(100, 55 - redFlagCount * 6 + positiveCount * 5));

  const overallScore = Math.round((clarityScore + impactScore + readabilityScore + hiringPotential) / 4);

  let verdict = "needs work fr fr";
  if (overallScore >= 80) verdict = "lowkey goated resume";
  else if (overallScore >= 60) verdict = "mid but fixable";
  else if (overallScore >= 40) verdict = "it's giving struggle";
  else verdict = "career crisis detected";

  return {
    overallScore,
    categories: [
      { name: "Clarity", score: clarityScore, icon: Target, color: "bg-accent" },
      { name: "Impact", score: impactScore, icon: Flame, color: "bg-destructive" },
      { name: "Readability", score: readabilityScore, icon: Sparkles, color: "bg-primary" },
      { name: "Hiring Potential", score: hiringPotential, icon: AlertTriangle, color: "bg-warning" },
    ],
    verdict,
  };
}

export function RoastScore({ content, isVisible }: RoastScoreProps) {
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (isVisible && content.length > 100) {
      const data = analyzeContent(content);
      setScores(data);

      // Animate the score
      let current = 0;
      const target = data.overallScore;
      const increment = target / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [content, isVisible]);

  if (!isVisible || !scores) return null;

  return (
    <div className="border-2 border-accent bg-card p-6 space-y-6">
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">RESUME ROAST SCORE</p>
        <div className="relative inline-block">
          <span
            className={cn(
              "text-6xl font-bold",
              animatedScore >= 70 ? "text-primary" : animatedScore >= 40 ? "text-warning" : "text-destructive"
            )}
          >
            {animatedScore}
          </span>
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">
          {scores.verdict}
        </p>
      </div>

      <div className="space-y-3">
        {scores.categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn("w-5 h-5 flex items-center justify-center", cat.color)}>
                    <Icon className="w-3 h-3 text-background" />
                  </div>
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono">{cat.score}%</span>
              </div>
              <div className="h-2 bg-muted overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-1000", cat.color)}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
