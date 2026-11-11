"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type Speaker } from "@/lib/api";
import { Avatar, Card, stagger } from "@/components/ui";

export default function Speakers() {
  const [q, setQ] = useState("");
  const [list, setList] = useState<Speaker[]>([]);
  useEffect(() => {
    const t = setTimeout(() => api<Speaker[]>(`/speakers?q=${encodeURIComponent(q)}`).then(setList).catch(() => {}), 200);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Speakers</h1>
      <p className="text-mute text-sm mb-4">Voices shaping AI.</p>
      <input className="field mb-5" placeholder="🔍  Search name or company" value={q} onChange={(e) => setQ(e.target.value)} />
      <motion.div variants={stagger} initial="hidden" animate="show" key={list.length} className="grid sm:grid-cols-2 gap-3">
        {list.map((s) => (
          <Card key={s.id} id={`s${s.id}`} className="p-4 flex gap-4">
            <Avatar name={s.name} size={52} />
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">{s.name}{s.featured && <span className="pill pill-gold">Featured</span>}</div>
              <div className="text-xs text-mute">{s.title} · {s.company}</div>
              <p className="text-sm text-mute mt-2">{s.bio}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
