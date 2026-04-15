"use client";

import { useEffect, useState } from "react";

const COLORS = ["#FAD4C0", "#80A1C1", "#16A34A", "#D97706", "#DC2626", "#F59E0B"];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

export default function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!show) return;

    const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 30,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: -(2 + Math.random() * 4),
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(timeout);
  }, [show]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiDrop 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            ['--vx' as string]: `${p.velocityX * 40}px`,
            ['--vy' as string]: `${p.velocityY * 80}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiDrop {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--vx, 0px), calc(var(--vy, 0px) + 400px)) rotate(720deg); }
        }
      `}</style>
    </div>
  );
}
