"use client";
import Link from "next/link";
import { useState } from "react";
import { post } from "@/lib/api";
import Logo from "@/components/Logo";
import { Button, Field, Notice, useForm } from "@/components/ui";

export default function SignUp() {
  const [v, setV] = useState({ name: "", email: "", password: "", organization: "", job_title: "" });
  const [token, setToken] = useState("");
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });
  const f = useForm(async (b: typeof v) => {
    const r = await post<{ message: string; dev_verify_token?: string }>("/auth/signup", b);
    setToken(r.dev_verify_token ?? "");
    return r.message;
  });
  return (
    <div className="glass p-7 w-full max-w-md">
      <Logo />
      <h1 className="text-2xl font-bold mt-5">Create your account</h1>
      <p className="text-mute text-sm mb-5">Join in under a minute and start sharing ideas.</p>
      {f.error && <Notice kind="error">{f.error}</Notice>}
      {f.ok && (
        <Notice kind="ok">
          {f.ok} {token && <Link className="underline" href={`/verify?token=${token}`}>Dev: verify now</Link>}
        </Notice>
      )}
      <form onSubmit={f.submit(v)}>
        <Field label="Full name" required value={v.name} onChange={set("name")} />
        <Field label="Email" type="email" required value={v.email} onChange={set("email")} />
        <Field label="Password (8+ characters)" type="password" minLength={8} required value={v.password} onChange={set("password")} />
        <Field label="Organization (optional)" value={v.organization} onChange={set("organization")} />
        <Field label="Job title (optional)" value={v.job_title} onChange={set("job_title")} />
        <Button type="submit" loading={f.loading}>Create account</Button>
      </form>
      <p className="text-sm text-mute text-center mt-4">Have an account? <Link className="link" href="/signin">Sign in</Link></p>
    </div>
  );
}
