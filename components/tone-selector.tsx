"use client";

import { cn } from "@/lib/utils";
import { Skull, Meh, Briefcase, Sparkles } from "lucide-react";

export type RoastTone = "savage" | "balanced" | "recruiter" | "chaotic";

interface ToneSelectorProps {
  selected: RoastTone;
  onSelect: (tone: RoastTone) => void;
  disabled?: boolean;
}

const tones: {
  id: RoastTone;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "savage",
    label: "NO MERCY",
    description: "Absolutely brutal. You asked for it.",
    icon: Skull,
    color: "bg-destructive",
  },
  {
    id: "balanced",
    label: "BALANCED",
    description: "Roast with a side of hope",
    icon: Meh,
    color: "bg-warning",
  },
  {
    id: "recruiter",
    label: "RECRUITER",
    description: "Professional disappointment",
    icon: Briefcase,
    color: "bg-accent",
  },
  {
    id: "chaotic",
    label: "CHAOTIC",
    description: "Unhinged Gen Z energy",
    icon: Sparkles,
    color: "bg-secondary",
  },
];

export function ToneSelector({
  selected,
  onSelect,
  disabled,
}: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tones.map((tone) => {
        const Icon = tone.icon;
        const isSelected = selected === tone.id;

        return (
          <button
            key={tone.id}
            type="button"
            onClick={() => onSelect(tone.id)}
            disabled={disabled}
            className={cn(
              "relative p-4 border-2 transition-all duration-200 text-left",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 bg-card",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center mb-2",
                tone.color
              )}
            >
              <Icon className="w-5 h-5 text-background" />
            </div>
            <p className="font-bold text-sm">{tone.label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tone.description}
            </p>
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
