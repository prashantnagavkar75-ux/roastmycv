"use client";

import { Skull, Scale, Briefcase, Quote } from "lucide-react";

const samples = [
  {
    tone: "NO MERCY",
    icon: Skull,
    color: "bg-destructive",
    quote: "bestie your resume is giving 'applied to 500 jobs and heard back from none' energy. the buzzwords are bussing... bussing you right to the rejection pile.",
  },
  {
    tone: "BALANCED",
    icon: Scale,
    color: "bg-secondary",
    quote: "okay so there's potential here fr. the experience section hits different but the formatting needs a glow up. let's fix this together.",
  },
  {
    tone: "RECRUITER",
    icon: Briefcase,
    color: "bg-primary",
    quote: "Your experience demonstrates relevant skills, however the lack of quantifiable achievements reduces overall impact. Consider adding metrics.",
  },
];

export function SampleRoasts() {
  return (
    <div className="space-y-4">
      <div className="bg-secondary p-3 brutal-border font-bold flex items-center gap-2">
        <Quote className="h-5 w-5" />
        SAMPLE ROASTS
      </div>
      
      <div className="space-y-3">
        {samples.map((sample, i) => (
          <div
            key={i}
            className="brutal-border brutal-shadow-sm bg-background overflow-hidden"
          >
            <div className={`${sample.color} px-3 py-2 flex items-center gap-2 border-b-4 border-foreground`}>
              <sample.icon className="h-4 w-4" />
              <span className="font-bold text-sm">{sample.tone}</span>
            </div>
            <p className="p-4 text-sm italic">&ldquo;{sample.quote}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
