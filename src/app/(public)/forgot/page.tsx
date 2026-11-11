"use client";
import Link from "next/link";
import { useState } from "react";
import { post } from "@/lib/api";
import Logo from "@/components/Logo";
import { Button, Field, Notice, useForm } from "@/components/ui";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const f = useForm(async () => {
    const r = await post<{ message: string; dev_reset_token?: string }>("/auth/forgot-password", { email });
    setToken(r.dev_reset_token ?? "");
    return r.message;
  });
  return (
    <div className="glass p-7 w-full max-w-md">
      <Logo />
      <h1 className="text-2xl font-bold mt-5">Forgot password</h1>
      <p className="text-mute text-sm mb-5">Enter your email and we&apos;ll send a reset link.</p>
      {f.error && <Notice kind="error">{f.error}</Notice>}
      {f.ok && <Notice kind="ok">{f.ok} {token && <Link className="underline" href={`/reset?token=${token}`}>Dev: open reset link</Link>}</Notice>}
      <form onSubmit={f.submit(null)}>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" loading={f.loading}>Send reset link</Button>
      </form>
      <p className="text-sm text-center mt-4"><Link className="link" href="/signin">Back to sign in</Link></p>
    </div>
  );
}
