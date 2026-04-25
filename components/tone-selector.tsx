"use client";

import { Skull, Scale, Briefcase } from "lucide-react";

export type Tone = "savage" | "balanced" | "recruiter";

interface ToneSelectorProps {
  selected: Tone;
  onSelect: (tone: Tone) => void;
}

const tones = [
  {
    id: "savage" as Tone,
    label: "NO MERCY",
    description: "absolutely unhinged roasts",
    icon: Skull,
    color: "bg-destructive",
  },
  {
    id: "balanced" as Tone,
    label: "BALANCED",
    description: "honest but not brutal",
    icon: Scale,
    color: "bg-secondary",
  },
  {
    id: "recruiter" as Tone,
    label: "RECRUITER",
    description: "professional feedback",
    icon: Briefcase,
    color: "bg-primary",
  },
];

export function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {tones.map((tone) => (
        <button
          key={tone.id}
          onClick={() => onSelect(tone.id)}
          className={`p-4 brutal-border brutal-shadow-sm brutal-shadow-hover transition-all ${
            selected === tone.id
              ? `${tone.color} scale-105`
              : "bg-background hover:bg-muted"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <tone.icon className="h-5 w-5" />
            <span className="font-bold">{tone.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">{tone.description}</p>
        </button>
      ))}
    </div>
  );
}
