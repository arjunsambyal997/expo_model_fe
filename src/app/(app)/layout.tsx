"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import { Avatar } from "@/components/ui";

const tabs = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/agenda", label: "Agenda", icon: "▦" },
  { href: "/speakers", label: "Speakers", icon: "☻" },
  { href: "/profile", label: "Profile", icon: "●" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (!loading && !user) router.replace("/signin"); }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-cyan" animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
      </div>
    );
  }
  const items = ["admin", "organizer"].includes(user.role) ? [...tabs, { href: "/admin", label: "Admin", icon: "★" }] : tabs;
  const active = (h: string) => path === h || (h === "/agenda" && path.startsWith("/sessions"));

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-bg0/60 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex gap-1 relative">
            {items.map((t) => (
              <Link key={t.href} href={t.href} className={`relative px-4 py-2 text-sm font-semibold ${active(t.href) ? "text-bg0" : "text-mute hover:text-ink"}`}>
                {active(t.href) && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-violet to-cyan" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className="relative">{t.label}</span>
              </Link>
            ))}
          </nav>
          <Link href="/profile"><Avatar name={user.name} size={36} /></Link>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-5 py-6">{children}</div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 backdrop-blur-xl bg-bg0/85 border-t border-white/10 flex justify-around pt-2 pb-4">
        {items.map((t) => (
          <Link key={t.href} href={t.href} className={`relative flex flex-col items-center text-[11px] px-3 ${active(t.href) ? "text-cyan" : "text-mute"}`}>
            {active(t.href) && <motion.span layoutId="dot" className="absolute -top-2 w-8 h-1 rounded-full bg-cyan" />}
            <span className="text-lg">{t.icon}</span>{t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
