"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Avatar, Button, Field, Notice, rise, stagger, useForm } from "@/components/ui";

export default function Profile() {
  const { user, reload, signOut } = useAuth();
  const router = useRouter();
  const [v, setV] = useState({ name: user!.name, organization: user!.organization, job_title: user!.job_title, bio: user!.bio, interests: user!.interests });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });
  const f = useForm(async (b: typeof v) => { await api("/users/me", { method: "PATCH", body: JSON.stringify(b) }); await reload(); return "Profile saved"; });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-xl">
      <motion.div variants={rise} className="text-center mb-6">
        <motion.div className="inline-block rounded-full p-1 bg-gradient-to-br from-gold to-violet" animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <div className="rounded-full bg-bg0 p-1"><Avatar name={user!.name} size={84} /></div>
        </motion.div>
        <h1 className="text-2xl font-extrabold mt-3">{user!.name}</h1>
        <p className="text-mute text-sm">{user!.job_title || "Attendee"} {user!.organization && `· ${user!.organization}`}</p>
        <span className="pill mt-2">{user!.role}</span> {user!.is_verified ? <span className="pill pill-gold">verified</span> : null}
      </motion.div>
      <motion.form variants={rise} onSubmit={f.submit(v)} className="glass p-5">
        {f.error && <Notice kind="error">{f.error}</Notice>}
        {f.ok && <Notice kind="ok">{f.ok}</Notice>}
        <Field label="Name" required value={v.name} onChange={set("name")} />
        <Field label="Organization" value={v.organization} onChange={set("organization")} />
        <Field label="Job title" value={v.job_title} onChange={set("job_title")} />
        <Field label="Bio" value={v.bio} onChange={set("bio")} />
        <Field label="Interests (comma separated)" value={v.interests} onChange={set("interests")} />
        <Button type="submit" loading={f.loading}>Save profile</Button>
      </motion.form>
      <motion.div variants={rise} className="grid gap-3 mt-4">
        <Link href="/settings" className="btn btn-ghost">Settings &amp; password</Link>
        <Button ghost onClick={async () => { await signOut(); router.push("/"); }}>Sign out</Button>
      </motion.div>
    </motion.div>
  );
}
