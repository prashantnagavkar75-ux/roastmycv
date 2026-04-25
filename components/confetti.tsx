"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

interface ConfettiProps {
  active: boolean;
  type?: "celebrate" | "cry";
}

const COLORS = {
  celebrate: ["#00ff88", "#00d4ff", "#ff3366", "#ffcc00", "#fafafa"],
  cry: ["#ff3366", "#0a0a0a", "#333333", "#666666"],
};

export function Confetti({ active, type = "celebrate" }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = COLORS[type];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: 2 + Math.random() * 3,
        },
      });
    }

    setParticles(newParticles);

    // Clear after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [active, type]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
