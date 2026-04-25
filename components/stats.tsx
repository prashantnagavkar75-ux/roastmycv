"use client";

import { useState, useEffect } from "react";
import { formatNumber } from "@/lib/utils";
import { Flame, Users, AlertTriangle, TrendingUp } from "lucide-react";

export function Stats() {
  const [roastCount, setRoastCount] = useState(42069);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoastCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Flame,
      value: formatNumber(roastCount),
      label: "Resumes Roasted",
      color: "text-destructive",
    },
    {
      icon: AlertTriangle,
      value: "847K",
      label: "Red Flags Found",
      color: "text-warning",
    },
    {
      icon: Users,
      value: "23K",
      label: "Careers Saved",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      value: "94%",
      label: "Got Jobs After",
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="border-2 border-border bg-card p-4 text-center hover:border-primary transition-colors"
          >
            <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
