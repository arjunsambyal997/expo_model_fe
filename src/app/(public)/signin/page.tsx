"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import { Button, Field, Notice, useForm } from "@/components/ui";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const f = useForm(async () => { await signIn(email, password); router.push("/dashboard"); });
  return (
    <div className="glass p-7 w-full max-w-md">
      <Logo />
      <h1 className="text-2xl font-bold mt-5">Welcome back</h1>
      <p className="text-mute text-sm mb-5">Sign in to see your schedule.</p>
      {f.error && <Notice kind="error">{f.error}</Notice>}
      <form onSubmit={f.submit(null)}>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="text-right text-sm mb-3"><Link className="link" href="/forgot">Forgot password?</Link></div>
        <Button type="submit" loading={f.loading}>Sign in</Button>
      </form>
      <p className="text-sm text-mute text-center mt-4">New here? <Link className="link" href="/signup">Create account</Link></p>
    </div>
  );
}
