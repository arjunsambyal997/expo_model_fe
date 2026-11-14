"use client";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/** Fades and lifts the direct children of its wrapper in one after another, using anime.js. */
export function StaggerIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(Array.from(el.children), {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(90),
      duration: 700,
      ease: "outExpo",
    });
    return () => { a.revert(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Soft drifting idea "bulbs" behind the sign-in card, animated with anime.js. */
export function FloatingOrbs() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(Array.from(el.children), {
      translateY: () => [0, -30 - Math.random() * 40],
      translateX: () => [0, (Math.random() - 0.5) * 60],
      scale: [1, 1.25],
      opacity: [0.35, 0.7],
      duration: () => 3500 + Math.random() * 2500,
      delay: stagger(300),
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });
    return () => { a.revert(); };
  }, []);
  const orbs = [
    "left-[10%] top-[18%] w-40 h-40 bg-violet/40",
    "right-[12%] top-[30%] w-52 h-52 bg-cyan/30",
    "left-[30%] bottom-[10%] w-44 h-44 bg-gold/30",
    "right-[28%] bottom-[18%] w-28 h-28 bg-violet/30",
  ];
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {orbs.map((c) => <span key={c} className={`absolute rounded-full blur-3xl opacity-0 ${c}`} />)}
    </div>
  );
}
