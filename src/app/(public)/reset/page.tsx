"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { post } from "@/lib/api";
import Logo from "@/components/Logo";
import { Button, Field, Notice, useForm } from "@/components/ui";

function Form() {
  const token = useSearchParams().get("token") ?? "";
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const f = useForm(async () => {
    if (pw !== pw2) throw new Error("Passwords do not match");
    await post("/auth/reset-password", { token, password: pw });
    return "Password updated. You can sign in now.";
  });
  return (
    <div className="glass p-7 w-full max-w-md">
      <Logo />
      <h1 className="text-2xl font-bold mt-5">Reset password</h1>
      <p className="text-mute text-sm mb-5">Choose a new password.</p>
      {f.error && <Notice kind="error">{f.error}</Notice>}
      {f.ok && <Notice kind="ok">{f.ok} <Link className="underline" href="/signin">Sign in</Link></Notice>}
      <form onSubmit={f.submit(null)}>
        <Field label="New password" type="password" minLength={8} required value={pw} onChange={(e) => setPw(e.target.value)} />
        <Field label="Confirm password" type="password" minLength={8} required value={pw2} onChange={(e) => setPw2(e.target.value)} />
        <Button type="submit" loading={f.loading}>Update password</Button>
      </form>
    </div>
  );
}
export default function Reset() { return <Suspense><Form /></Suspense>; }
