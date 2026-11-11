"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, type Talk } from "@/lib/api";
import TalkCard from "@/components/TalkCard";
import { stagger } from "@/components/ui";

export default function Agenda() {
  const [day, setDay] = useState(1);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [mineOnly, setMineOnly] = useState(false);
  useEffect(() => { api<Talk[]>(`/sessions?day=${day}`).then(setTalks).catch(() => {}); }, [day]);
  const shown = mineOnly ? talks.filter((t) => t.saved) : talks;

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Agenda</h1>
      <p className="text-mute text-sm mb-5">Pick a day, star what you like.</p>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[1, 2, 3].map((d) => (
          <button key={d} onClick={() => setDay(d)} className={`relative px-4 py-2 rounded-full text-sm font-semibold border border-white/15 ${day === d ? "text-bg0 border-transparent" : "text-mute"}`}>
            {day === d && <motion.span layoutId="day" className="absolute inset-0 rounded-full bg-gradient-to-r from-violet to-cyan" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative">Day {d}</span>
          </button>
        ))}
        <button onClick={() => setMineOnly(!mineOnly)} className={`ml-auto px-4 py-2 rounded-full text-sm font-semibold border ${mineOnly ? "border-gold text-gold" : "border-white/15 text-mute"}`}>★ My schedule</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={`${day}-${mineOnly}`} variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="grid gap-3">
          {shown.map((t) => <TalkCard key={t.id} talk={t} onChange={(s) => setTalks((p) => p.map((x) => (x.id === t.id ? { ...x, saved: s } : x)))} />)}
          {shown.length === 0 && <p className="text-mute text-center py-10">Nothing here yet.</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
