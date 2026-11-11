"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, post, tokens } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Field, Notice, useForm } from "@/components/ui";

export default function Settings() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const f = useForm(async () => {
    await post("/auth/change-password", { current_password: cur, new_password: nw });
    tokens.set(null);
    await signOut();
    router.push("/signin");
  });
  const del = async () => {
    if (!confirm("Delete your account permanently?")) return;
    await api("/users/me", { method: "DELETE" });
    await signOut();
    router.push("/");
  };
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-extrabold mb-5">Settings</h1>
      <form onSubmit={f.submit(null)} className="glass p-5 mb-4">
        <h2 className="font-bold mb-3">Change password</h2>
        {f.error && <Notice kind="error">{f.error}</Notice>}
        <Field label="Current password" type="password" required value={cur} onChange={(e) => setCur(e.target.value)} />
        <Field label="New password (8+ characters)" type="password" minLength={8} required value={nw} onChange={(e) => setNw(e.target.value)} />
        <Button type="submit" loading={f.loading}>Update password</Button>
        <p className="text-xs text-mute mt-2">You&apos;ll be signed out on all devices.</p>
      </form>
      <div className="glass p-5 grid gap-3">
        <Button ghost onClick={async () => { await post("/auth/signout-all"); await signOut(); router.push("/signin"); }}>Sign out of all devices</Button>
        <Button ghost onClick={del} style={{ color: "#ff8a8a" }}>Delete account</Button>
      </div>
    </div>
  );
}
