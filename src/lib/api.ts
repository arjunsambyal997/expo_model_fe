const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export type User = {
  id: number; email: string; name: string; role: string; organization: string;
  job_title: string; bio: string; interests: string; is_verified: boolean;
};
export type Idea = {
  id: number; title: string; description: string; author_name: string;
  created_at: string; votes: number; voted: boolean;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

const KEY = "expo_tokens";
type Tokens = { access_token: string; refresh_token: string };

export const tokens = {
  get(): Tokens | null {
    try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set(t: Tokens | null) {
    try { t ? localStorage.setItem(KEY, JSON.stringify(t)) : localStorage.removeItem(KEY); } catch {}
  },
};

async function raw(path: string, init: RequestInit = {}, token?: string): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${BASE}${path}`, { ...init, headers });
}

let refreshing: Promise<Tokens | null> | null = null;
async function refresh(): Promise<Tokens | null> {
  const t = tokens.get();
  if (!t) return null;
  refreshing ??= raw("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token: t.refresh_token }) })
    .then(async (r) => { if (!r.ok) { tokens.set(null); return null; } const n = await r.json(); tokens.set(n); return n as Tokens; })
    .finally(() => { refreshing = null; });
  return refreshing;
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  let t = tokens.get();
  let res = await raw(path, init, t?.access_token);
  if (res.status === 401 && t) {
    t = await refresh();
    if (t) res = await raw(path, init, t.access_token);
  }
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = typeof j.detail === "string" ? j.detail : j.detail?.[0]?.msg ?? msg;
    } catch {}
    throw new ApiError(res.status, msg);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const post = <T = unknown>(path: string, body?: unknown) =>
  api<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
