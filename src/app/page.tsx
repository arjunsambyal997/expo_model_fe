"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Card, stagger, rise } from "@/components/ui";
import { useAuth } from "@/lib/auth";

const towers = [
  { h: 160, w: 14, x: 0 }, { h: 110, w: 10, x: 22 }, { h: 210, w: 12, x: 44 },
  { h: 90, w: 9, x: 66 }, { h: 140, w: 11, x: 84 }, { h: 70, w: 8, x: 104 },
];

export default function Landing() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => { if (user) router.replace("/dashboard"); }, [user, router]);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-5 py-6 flex flex-col">
      <header className="flex items-center justify-between">
        <Logo />
        <Link href="/signin" className="link">Sign in</Link>
      </header>

      <motion.section variants={stagger} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-10 items-center flex-1 py-12">
        <div>
          <motion.span variants={rise} className="pill pill-gold font-bold tracking-wider">DUBAI · 1–3 MARCH 2027</motion.span>
          <motion.h1 variants={rise} className="text-5xl md:text-6xl font-extrabold leading-[1.05] mt-4 tracking-tight">
            Where <span className="text-grad">AI leaders</span> meet.
          </motion.h1>
          <motion.p variants={rise} className="text-mute mt-4 max-w-md">
            Three days of keynotes, workshops and conversations. Build your personal schedule and meet the people shaping what&apos;s next.
          </motion.p>
          <motion.div variants={rise} className="flex gap-3 mt-7 max-w-sm">
            <Link href="/signup" className="btn">Create account</Link>
            <Link href="/signin" className="btn btn-ghost">Sign in</Link>
          </motion.div>
          <motion.div variants={rise} className="grid grid-cols-3 gap-3 mt-8 max-w-sm">
            {[["3", "days"], ["120", "speakers"], ["40", "sessions"]].map(([n, l]) => (
              <Card key={l} className="p-3 text-center"><b className="text-xl block">{n}</b><span className="text-xs text-mute">{l}</span></Card>
            ))}
          </motion.div>
        </div>

        <motion.div variants={rise} className="relative h-[360px] glass overflow-hidden"
          style={{ background: "radial-gradient(circle at 70% 25%,rgba(77,224,208,.5),transparent 45%),radial-gradient(circle at 20% 70%,rgba(122,108,255,.6),transparent 50%),linear-gradient(160deg,#141c4d,#0a0f2a)" }}>
          <motion.div className="absolute w-24 h-24 rounded-full bg-gold/90 blur-[2px]" style={{ right: 50, top: 40 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }} transition={{ duration: 5, repeat: Infinity }} />
          <div className="absolute bottom-0 left-8 flex items-end gap-3">
            {towers.map((t, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: t.h }} transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: "easeOut" }}
                style={{ width: t.w * 2.4 }} className="rounded-t-md bg-gradient-to-t from-white/5 to-white/35 border border-white/10" />
            ))}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
