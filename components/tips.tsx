"use client";

import { Lightbulb, ChevronRight } from "lucide-react";
import { useState } from "react";

const tips = [
  {
    title: "Quantify Everything",
    content: "Numbers hit different. Instead of 'improved sales', say 'increased sales by 47% in Q3'. Recruiters eat that up fr fr.",
  },
  {
    title: "Kill the Buzzwords",
    content: "'Synergized cross-functional paradigms' is giving corporate word salad. Be specific about what you actually did.",
  },
  {
    title: "One Page Gang",
    content: "Unless you're a senior exec with 15+ years, keep it to one page. No one's reading your 3-page novel bestie.",
  },
  {
    title: "ATS is Watching",
    content: "Applicant Tracking Systems filter out creative formatting. Keep it simple, use keywords from the job description.",
  },
  {
    title: "Active Voice Only",
    content: "'Led a team of 5' > 'Was responsible for leading'. Action verbs make you sound like you actually did stuff.",
  },
];

export function Tips() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="brutal-border brutal-shadow bg-background">
      <div className="bg-primary p-3 border-b-4 border-foreground font-bold flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        PRO TIPS TO NOT BE MID
      </div>
      <div className="divide-y-4 divide-foreground">
        {tips.map((tip, i) => (
          <div key={i} className="cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
              <span className="font-bold">{tip.title}</span>
              <ChevronRight className={`h-5 w-5 transition-transform ${expanded === i ? "rotate-90" : ""}`} />
            </div>
            {expanded === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground">
                {tip.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
