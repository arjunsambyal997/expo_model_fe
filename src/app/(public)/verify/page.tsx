"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { post } from "@/lib/api";
import Logo from "@/components/Logo";

function Verify() {
  const token = useSearchParams().get("token");
  const [state, setState] = useState<"wait" | "ok" | "bad">(token ? "wait" : "bad");
  useEffect(() => {
    if (!token) return;
    post("/auth/verify-email", { token }).then(() => setState("ok")).catch(() => setState("bad"));
  }, [token]);
  return (
    <div className="glass p-7 w-full max-w-md text-center">
      <Logo />
      <motion.div key={state} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}
        className={`mx-auto mt-6 w-16 h-16 rounded-full flex items-center justify-center text-3xl ${state === "ok" ? "bg-cyan/20 text-cyan" : state === "bad" ? "bg-red-500/20 text-red-300" : "bg-white/10"}`}>
        {state === "ok" ? "✓" : state === "bad" ? "!" : "…"}
      </motion.div>
      <h1 className="text-2xl font-bold mt-4">{state === "ok" ? "Email verified" : state === "bad" ? "Link invalid or expired" : "Verifying…"}</h1>
      <p className="text-sm mt-5"><Link className="link" href="/signin">Continue to sign in</Link></p>
    </div>
  );
}
export default function Page() { return <Suspense><Verify /></Suspense>; }
