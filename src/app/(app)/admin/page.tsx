"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type User } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Avatar, Card, stagger } from "@/components/ui";

const roles = ["attendee", "speaker", "organizer", "admin"];

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [denied, setDenied] = useState(false);
  useEffect(() => { api<User[]>("/admin/users").then(setUsers).catch(() => setDenied(true)); }, []);
  const setRole = async (id: number, role: string) => {
    const u = await api<User>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
    setUsers((p) => p.map((x) => (x.id === id ? u : x)));
  };
  if (denied) return <p className="text-mute">You don&apos;t have access to this page.</p>;
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-5">Users</h1>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3">
        {users.map((u) => (
          <Card key={u.id} className="p-4 flex items-center gap-3">
            <Avatar name={u.name} />
            <div className="flex-1 min-w-0"><div className="font-semibold">{u.name}</div><div className="text-xs text-mute truncate">{u.email}</div></div>
            <select disabled={user?.role !== "admin"} value={u.role} onChange={(e) => setRole(u.id, e.target.value)} className="field !w-auto !py-1.5 text-sm">
              {roles.map((r) => <option key={r} value={r} className="text-black">{r}</option>)}
            </select>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
