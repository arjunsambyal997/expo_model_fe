"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type Idea } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CountUp, rise, stagger } from "@/components/ui";

export default function Dashboard() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  useEffect(() => { api<Idea[]>("/ideas").then(setIdeas).catch(() => {}); }, []);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const myVotes = ideas.filter((i) => i.voted).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={rise} className="mb-5">
        <p className="text-mute text-sm">{greet}</p>
        <h1 className="text-3xl font-extrabold">{user?.name.split(" ")[0]}</h1>
      </motion.div>

      <motion.div variants={rise} className="rounded-3xl p-6 mb-5 border border-white/15"
        style={{ background: "linear-gradient(135deg,rgba(122,108,255,.4),rgba(77,224,208,.22))" }}>
        <span className="pill pill-gold">What this app is for</span>
        <h2 className="text-2xl font-bold mt-3 max-w-lg">Pick what we build for the Dubai Expo AI Summit</h2>
        <p className="text-mute text-sm mt-2 max-w-lg">
          We have not decided what to build yet. Add your idea with a clear explanation, vote on the ones you like, and the team will work on the top ideas next.
        </p>
        <Link href="/ideas" className="btn mt-4 inline-block max-w-xs">Add or vote on ideas</Link>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-2 gap-3 mb-6">
        {[["Ideas", ideas.length], ["Your votes", myVotes]].map(([l, n]) => (
          <Card key={l as string} className="p-4 text-center"><b className="text-2xl block"><CountUp to={n as number} /></b><span className="text-xs text-mute">{l}</span></Card>
        ))}
      </motion.div>

      <motion.h3 variants={rise} className="font-bold mb-3">Top ideas right now</motion.h3>
      <motion.div variants={stagger} className="grid gap-3">
        {ideas.slice(0, 3).map((i) => (
          <Link key={i.id} href="/ideas">
            <Card className="p-4 flex justify-between gap-3"><span className="font-semibold">{i.title}</span><span className="text-mute text-sm shrink-0">▲ {i.votes}</span></Card>
          </Link>
        ))}
        {ideas.length === 0 && <p className="text-mute text-sm">No ideas yet.</p>}
      </motion.div>
    </motion.div>
  );
}
