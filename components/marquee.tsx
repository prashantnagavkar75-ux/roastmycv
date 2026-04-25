"use client";

export function Marquee() {
  const items = [
    "YOUR RESUME IS MID",
    "NO MERCY MODE ACTIVATED",
    "RED FLAGS DETECTED",
    "CAREER CRISIS LOADING",
    "RECRUITER NIGHTMARES",
    "FIX IT OR COPE",
    "AI HAS NO CHILL",
    "BUZZWORD BINGO WINNER",
  ];

  const repeatedItems = [...items, ...items];

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden border-b-2 border-border">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeatedItems.map((item, index) => (
          <span key={index} className="mx-8 font-bold text-sm tracking-wide">
            {item} *
          </span>
        ))}
      </div>
    </div>
  );
}
