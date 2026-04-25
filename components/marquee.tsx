"use client";

import { Flame, Skull, Star, Zap } from "lucide-react";

const items = [
  { text: "NO MERCY MODE", icon: Skull },
  { text: "YOUR RESUME IS MID", icon: Star },
  { text: "INDIA'S #1 RESUME ROASTER", icon: Flame },
  { text: "FR FR NO CAP", icon: Zap },
  { text: "DELULU IS NOT THE SOLULU", icon: Star },
  { text: "SLAY OR GET SLAYED", icon: Flame },
];

export function Marquee() {
  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 mx-8">
          <item.icon className="h-4 w-4" />
          {item.text}
        </span>
      ))}
    </>
  );

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden border-b-4 border-foreground">
      <div className="flex animate-marquee whitespace-nowrap">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}

export function MarqueeReverse() {
  const content = (
    <>
      {items.reverse().map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 mx-8">
          <item.icon className="h-4 w-4" />
          {item.text}
        </span>
      ))}
    </>
  );

  return (
    <div className="bg-accent text-accent-foreground py-2 overflow-hidden border-y-4 border-foreground">
      <div className="flex animate-marquee-reverse whitespace-nowrap">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}
