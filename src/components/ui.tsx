"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useEffect, useState } from "react";

export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } } };

export function Card({ className = "", ...p }: HTMLMotionProps<"div">) {
  return <motion.div variants={rise} whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }} className={`glass ${className}`} {...p} />;
}

export function Button({ children, ghost, loading, ...p }: HTMLMotionProps<"button"> & { ghost?: boolean; loading?: boolean }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`btn ${ghost ? "btn-ghost" : ""}`} disabled={loading || p.disabled} {...p}>
      {loading ? "Please wait…" : children}
    </motion.button>
  );
}

export function Field({ label, error, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block mb-3">
      <span className="text-xs text-mute">{label}</span>
      <input className="field mt-1" {...p} />
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

export function Notice({ kind, children }: { kind: "error" | "ok"; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0, x: kind === "error" ? -8 : 0 }} animate={{ opacity: 1, height: "auto", x: kind === "error" ? [0, -6, 6, -4, 4, 0] : 0 }}
      className={`rounded-xl px-3 py-2 mb-3 text-sm ${kind === "error" ? "bg-red-500/15 text-red-200" : "bg-cyan/15 text-cyan"}`}>
      {children}
    </motion.div>
  );
}

export function useForm<T>(fn: (v: T) => Promise<string | void>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const submit = (v: T) => async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setOk("");
    try { const m = await fn(v); if (m) setOk(m); } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    setLoading(false);
  };
  return { loading, error, ok, submit };
}

export function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let id = 0;
    const tick = (t: number) => { const p = Math.min((t - start) / 900, 1); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) id = requestAnimationFrame(tick); };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{n}</>;
}

export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
export const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const grads = ["from-violet to-cyan", "from-gold to-[#d9a441]", "from-[#ff8ab3] to-violet", "from-cyan to-violet"];
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const g = grads[name.length % grads.length];
  return <div style={{ width: size, height: size, fontSize: size / 2.8 }} className={`rounded-full bg-gradient-to-br ${g} flex items-center justify-center font-bold text-bg0 shrink-0`}>{initials(name)}</div>;
}
