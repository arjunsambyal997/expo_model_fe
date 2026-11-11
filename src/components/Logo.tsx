"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg">
      <motion.span animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet to-cyan inline-block" />
      Expo AI Summit
    </Link>
  );
}
