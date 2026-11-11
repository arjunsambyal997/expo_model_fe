"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type Speaker, type Talk } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Avatar, Card, CountUp, fmtTime, rise, stagger } from "@/components/ui";
import TalkCard from "@/components/TalkCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [mine, setMine] = useState<Talk[]>([]);
  const [all, setAll] = useState<Talk[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  useEffect(() => {
    api<Talk[]>("/me/schedule").then(setMine).catch(() => {});
    api<Talk[]>("/sessions").then(setAll).catch(() => {});
    api<Speaker[]>("/speakers").then(setSpeakers).catch(() => {});
  }, []);
  const next = mine[0] ?? all[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={rise} className="mb-5">
        <p className="text-mute text-sm">{greet}</p>
        <h1 className="text-3xl font-extrabold">{user?.name.split(" ")[0]} <motion.span className="inline-block" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.6, delay: 0.6 }}>👋</motion.span></h1>
      </motion.div>

      {user && !user.is_verified && (
        <motion.div variants={rise} className="rounded-xl px-4 py-3 mb-5 bg-gold/15 text-gold text-sm">Verify your email to unlock networking features.</motion.div>
      )}

      {next && (
        <Link href={`/sessions/${next.id}`}>
          <motion.div variants={rise} whileHover={{ scale: 1.01 }} className="rounded-3xl p-6 mb-5 border border-white/15 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,rgba(122,108,255,.4),rgba(77,224,208,.22))" }}>
            <motion.span className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-cyan/20 blur-2xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />
            <span className="pill pill-gold">{mine[0] ? "Up next in your schedule" : "Featured session"} · {fmtTime(next.starts_at)}</span>
            <h2 className="text-2xl font-bold mt-3 max-w-lg">{next.title}</h2>
            <p className="text-mute text-sm mt-1">{next.room} · Day {next.day}</p>
          </motion.div>
        </Link>
      )}

      <motion.div variants={stagger} className="grid grid-cols-3 gap-3 mb-6">
        {[["Saved", mine.length], ["Sessions", all.length], ["Speakers", speakers.length]].map(([l, n]) => (
          <Card key={l as string} className="p-4 text-center"><b className="text-2xl block"><CountUp to={n as number} /></b><span className="text-xs text-mute">{l}</span></Card>
        ))}
      </motion.div>

      <motion.h3 variants={rise} className="font-bold mb-3">Featured speakers</motion.h3>
      <motion.div variants={stagger} className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {speakers.filter((s) => s.featured).map((s) => (
          <Link key={s.id} href={`/speakers#s${s.id}`}>
            <Card className="p-4 w-36 text-center shrink-0"><div className="flex justify-center mb-2"><Avatar name={s.name} size={52} /></div><div className="font-semibold text-sm">{s.name}</div><div className="text-xs text-mute">{s.company}</div></Card>
          </Link>
        ))}
      </motion.div>

      <motion.h3 variants={rise} className="font-bold mb-3">Today&apos;s highlights</motion.h3>
      <motion.div variants={stagger} className="grid gap-3">{all.filter((t) => t.day === 1).slice(0, 3).map((t) => <TalkCard key={t.id} talk={t} />)}</motion.div>
    </motion.div>
  );
}
