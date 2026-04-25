"use client";

import { cn } from "@/lib/utils";
import { Skull, Meh, Briefcase, Sparkles } from "lucide-react";

const samples = [
  {
    tone: "NO MERCY",
    icon: Skull,
    color: "bg-destructive",
    roast:
      '"Your resume has more buzzwords than a LinkedIn influencer\'s fever dream. \'Synergy enthusiast\' is not a skill, bestie."',
  },
  {
    tone: "BALANCED",
    icon: Meh,
    color: "bg-warning",
    roast:
      '"This looks decent, but nothing stands out. You\'re giving \'safe choice\' energy when you should be giving \'must-hire\'."',
  },
  {
    tone: "RECRUITER",
    icon: Briefcase,
    color: "bg-accent",
    roast:
      '"Your experience lacks measurable impact. Consider quantifying achievements—\'helped team\' should become \'increased revenue 30%.\'\"',
  },
  {
    tone: "CHAOTIC",
    icon: Sparkles,
    color: "bg-secondary",
    roast:
      '"bestie this resume is giving \'wrote it at 3am powered by monster energy and delusion\' vibes. we need to talk."',
  },
];

export function SampleRoasts() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <span className="bg-primary text-primary-foreground px-2 py-1">
          SAMPLE ROASTS
        </span>
      </h3>
      <div className="grid gap-4">
        {samples.map((sample, index) => {
          const Icon = sample.icon;
          return (
            <div
              key={index}
              className="border-2 border-border bg-card p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center",
                    sample.color
                  )}
                >
                  <Icon className="w-4 h-4 text-background" />
                </div>
                <span className="font-bold text-sm">{sample.tone}</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {sample.roast}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
