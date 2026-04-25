"use client";

import { useState, useEffect } from "react";
import { Trophy, RefreshCw } from "lucide-react";

const shamefulExamples = [
  {
    excerpt: '"Proficient in Microsoft Office"',
    roast: "wow congrats you can open excel. revolutionary.",
  },
  {
    excerpt: '"Team player with excellent communication skills"',
    roast: "said literally everyone ever. next.",
  },
  {
    excerpt: '"Objective: To obtain a position..."',
    roast: "objectives went out of style with flip phones.",
  },
  {
    excerpt: '"References available upon request"',
    roast: "yeah we know. that's how it works.",
  },
  {
    excerpt: '"Hard worker"',
    roast: "not a skill. that's just... existing at a job.",
  },
  {
    excerpt: '"Thinking outside the box"',
    roast: "the most inside-the-box phrase to ever exist.",
  },
  {
    excerpt: '"Detail-oriented"',
    roast: "misspelled in the resume. the irony.",
  },
  {
    excerpt: '"Go-getter"',
    roast: "go get a better word for this.",
  },
  {
    excerpt: '"Synergy"',
    roast: "corporate bingo just called. you won.",
  },
  {
    excerpt: '"Passionate about everything"',
    roast: "that's not passion, that's desperation.",
  },
];

export function HallOfShame() {
  const [currentExample, setCurrentExample] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentExample((prev) => (prev + 1) % shamefulExamples.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const shuffleExample = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentExample(Math.floor(Math.random() * shamefulExamples.length));
      setIsAnimating(false);
    }, 300);
  };

  const example = shamefulExamples[currentExample];

  return (
    <div className="border-2 border-destructive bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-destructive" />
          <h3 className="font-bold text-sm">HALL OF SHAME</h3>
        </div>
        <button
          onClick={shuffleExample}
          className="p-1 hover:bg-muted transition-colors"
          title="Show another"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div
        className={`transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-sm font-mono text-destructive mb-2">
          {example.excerpt}
        </p>
        <p className="text-xs text-muted-foreground italic">{example.roast}</p>
      </div>

      <div className="flex gap-1 mt-3">
        {shamefulExamples.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 transition-colors ${
              index === currentExample ? "bg-destructive" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
