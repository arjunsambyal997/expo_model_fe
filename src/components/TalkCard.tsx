"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, type Talk } from "@/lib/api";
import { Card, fmtTime } from "./ui";

export function StarButton({ talk, onChange }: { talk: Talk; onChange?: (saved: boolean) => void }) {
  const [saved, setSaved] = useState(talk.saved);
  const [burst, setBurst] = useState(0);
  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const next = !saved;
    setSaved(next);
    if (next) setBurst((b) => b + 1);
    try { await api(`/me/schedule/${talk.id}`, { method: next ? "PUT" : "DELETE" }); onChange?.(next); } catch { setSaved(!next); }
  };
  return (
    <motion.button onClick={toggle} whileTap={{ scale: 0.7 }} aria-label={saved ? "Remove from schedule" : "Save to schedule"} className="relative text-2xl w-9 h-9 flex items-center justify-center">
      <motion.span animate={saved ? { scale: [1, 1.5, 1], rotate: [0, 20, 0] } : { scale: 1 }} className={saved ? "text-gold" : "text-mute"}>{saved ? "★" : "☆"}</motion.span>
      <AnimatePresence>
        {burst > 0 && saved && Array.from({ length: 6 }).map((_, i) => (
          <motion.i key={`${burst}-${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-gold" initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: Math.cos((i / 6) * 6.28) * 22, y: Math.sin((i / 6) * 6.28) * 22, opacity: 0 }} transition={{ duration: 0.6 }} />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

export default function TalkCard({ talk, onChange }: { talk: Talk; onChange?: (saved: boolean) => void }) {
  return (
    <Link href={`/sessions/${talk.id}`} className="block">
      <Card className="p-4 flex items-center gap-4">
        <div className="w-14 text-gold font-bold text-sm">{fmtTime(talk.starts_at)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{talk.title}</div>
          <div className="text-xs text-mute mt-1 flex items-center gap-2 flex-wrap">
            {talk.room}<span className={`pill ${talk.track === "Workshop" ? "pill-gold" : ""}`}>{talk.track}</span>
          </div>
        </div>
        <StarButton talk={talk} onChange={onChange} />
      </Card>
    </Link>
  );
}
