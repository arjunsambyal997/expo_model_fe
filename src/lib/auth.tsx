"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, post, tokens, type User } from "./api";

type Ctx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  reload: () => Promise<void>;
};
const AuthCtx = createContext<Ctx>(null!);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!tokens.get()) { setUser(null); setLoading(false); return; }
    try { setUser(await api<User>("/users/me")); } catch { setUser(null); }
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const signIn = async (email: string, password: string) => {
    tokens.set(await post("/auth/signin", { email, password }));
    await reload();
  };
  const signOut = async () => {
    const t = tokens.get();
    if (t) await post("/auth/signout", { refresh_token: t.refresh_token }).catch(() => {});
    tokens.set(null);
    setUser(null);
  };
  return <AuthCtx.Provider value={{ user, loading, signIn, signOut, reload }}>{children}</AuthCtx.Provider>;
}
