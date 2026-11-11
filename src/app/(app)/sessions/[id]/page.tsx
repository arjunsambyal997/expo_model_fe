"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type Talk } from "@/lib/api";
import { Avatar, Card, fmtTime, rise, stagger } from "@/components/ui";
import { StarButton } from "@/components/TalkCard";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [t, setT] = useState<Talk | null>(null);
  useEffect(() => { api<Talk>(`/sessions/${id}`).then(setT).catch(() => {}); }, [id]);
  if (!t) return <p className="text-mute">Loading…</p>;
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
      <Link href="/agenda" className="link text-sm">← Agenda</Link>
      <motion.div variants={rise} className="rounded-3xl p-7 mt-4 border border-white/15" style={{ background: "linear-gradient(135deg,rgba(122,108,255,.45),rgba(77,224,208,.2))" }}>
        <span className="pill pill-gold font-bold">{t.track.toUpperCase()}</span>
        <h1 className="text-3xl font-extrabold mt-3">{t.title}</h1>
        <div className="flex gap-2 mt-4 flex-wrap text-xs"><span className="pill pill-gold">Day {t.day} · {fmtTime(t.starts_at)}–{fmtTime(t.ends_at)}</span><span className="pill">{t.room}</span></div>
      </motion.div>
      <motion.p variants={rise} className="text-mute mt-5">{t.description}</motion.p>
      <motion.h3 variants={rise} className="font-bold mt-6 mb-3">Speakers</motion.h3>
      <div className="grid gap-3 mb-6">
        {t.speakers.map((s) => (
          <Link key={s.id} href={`/speakers#s${s.id}`}><Card className="p-4 flex items-center gap-3"><Avatar name={s.name} /><div><div className="font-semibold">{s.name}</div><div className="text-xs text-mute">{s.title} · {s.company}</div></div></Card></Link>
        ))}
      </div>
      <motion.div variants={rise} className="glass p-4 flex items-center justify-between"><span className="font-semibold">Add to my schedule</span><StarButton talk={t} /></motion.div>
    </motion.div>
  );
}
