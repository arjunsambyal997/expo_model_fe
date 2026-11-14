"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import { FloatingOrbs, StaggerIn } from "@/components/AnimeIn";
import { Button, Field, Notice, useForm } from "@/components/ui";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const demos = [
    { label: "Demo user", email: "demo@expo-summit.dev", password: "demo12345" },
    { label: "Admin", email: "admin@expo-summit.dev", password: "admin12345" },
  ];
  const f = useForm(async () => { await signIn(email, password); router.push("/dashboard"); });
  return (
    <>
    <FloatingOrbs />
    <div className="glass p-7 w-full max-w-md relative">
      <StaggerIn>
      <Logo />
      <h1 className="text-2xl font-bold mt-5">Welcome back</h1>
      <p className="text-mute text-sm mb-5">Sign in to share your ideas and vote on what we build next.</p>
      <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 mb-4 text-sm">
        <div className="font-semibold text-gold mb-1">Demo logins</div>
        {demos.map((d) => (
          <div key={d.email} className="flex items-center justify-between gap-2 py-1">
            <span className="text-mute">
              {d.label}: <code className="text-ink">{d.email}</code> / <code className="text-ink">{d.password}</code>
            </span>
            <button type="button" className="link shrink-0" onClick={() => { setEmail(d.email); setPassword(d.password); }}>Use</button>
          </div>
        ))}
      </div>
      {f.error && <Notice kind="error">{f.error}</Notice>}
      <form onSubmit={f.submit(null)}>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="text-right text-sm mb-3"><Link className="link" href="/forgot">Forgot password?</Link></div>
        <Button type="submit" loading={f.loading}>Sign in</Button>
      </form>
      <p className="text-sm text-mute text-center mt-4">New here? <Link className="link" href="/signup">Create account</Link></p>
      </StaggerIn>
    </div>
    </>
  );
}
