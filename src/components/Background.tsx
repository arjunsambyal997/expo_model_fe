"use client";
import { useEffect, useState } from "react";

export default function Background() {
  const [stars, setStars] = useState<{ x: number; y: number; d: number }[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: 40 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, d: Math.random() * 3 })));
  }, []);
  return (
    <div aria-hidden>
      <div className="orb" style={{ width: 460, height: 460, left: "-8%", top: "-6%", background: "#7a6cff55", animation: "float 14s ease-in-out infinite" }} />
      <div className="orb" style={{ width: 520, height: 520, right: "-10%", top: "20%", background: "#4de0d044", animation: "float2 18s ease-in-out infinite" }} />
      <div className="orb" style={{ width: 380, height: 380, left: "25%", bottom: "-12%", background: "#e6b86533", animation: "float 20s ease-in-out infinite" }} />
      {stars.map((s, i) => (
        <span key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }} />
      ))}
    </div>
  );
}
