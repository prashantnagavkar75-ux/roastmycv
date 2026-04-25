"use client";

import { Flame, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Stats() {
  const { data } = useSWR("/api/stats", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });
  
  const [displayCount, setDisplayCount] = useState(18742);

  useEffect(() => {
    if (data?.totalRoasts) {
      // Animate the counter
      const target = data.totalRoasts;
      const increment = Math.ceil((target - displayCount) / 20);
      if (increment > 0) {
        const timer = setInterval(() => {
          setDisplayCount((prev) => {
            if (prev >= target) {
              clearInterval(timer);
              return target;
            }
            return prev + increment;
          });
        }, 50);
        return () => clearInterval(timer);
      }
    }
  }, [data?.totalRoasts, displayCount]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="brutal-border brutal-shadow-sm bg-primary p-4 text-center">
        <Flame className="h-6 w-6 mx-auto mb-2" />
        <div className="text-2xl font-bold font-mono">{displayCount.toLocaleString()}</div>
        <div className="text-xs font-medium">ROASTS SERVED</div>
      </div>
      <div className="brutal-border brutal-shadow-sm bg-secondary p-4 text-center">
        <Users className="h-6 w-6 mx-auto mb-2" />
        <div className="text-2xl font-bold font-mono">{data?.todayRoasts || 156}</div>
        <div className="text-xs font-medium">TODAY</div>
      </div>
      <div className="brutal-border brutal-shadow-sm bg-accent text-accent-foreground p-4 text-center">
        <TrendingUp className="h-6 w-6 mx-auto mb-2" />
        <div className="text-2xl font-bold font-mono">{data?.avgRating || 2.4}/10</div>
        <div className="text-xs font-medium">AVG SCORE</div>
      </div>
    </div>
  );
}
