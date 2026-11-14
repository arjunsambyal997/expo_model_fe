"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, post, type Idea } from "@/lib/api";
import { Button, Card, Field, Notice, rise, stagger, useForm } from "@/components/ui";

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [sort, setSort] = useState<"top" | "new">("top");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const load = () => api<Idea[]>(`/ideas?sort=${sort}`).then(setIdeas).catch(() => {});
  useEffect(() => { load(); }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const f = useForm(async () => {
    await post("/ideas", { title, description });
    setTitle(""); setDescription("");
    await load();
    return "Idea added. Thanks!";
  });

  const toggle = async (i: Idea) => {
    const updated = await api<Idea>(`/ideas/${i.id}/vote`, { method: i.voted ? "DELETE" : "PUT" });
    setIdeas((all) => all.map((x) => (x.id === i.id ? updated : x)));
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={rise} className="mb-5">
        <h1 className="text-3xl font-extrabold">Ideas</h1>
        <p className="text-mute text-sm mt-1 max-w-xl">
          Propose what we should build for the Dubai Expo AI Summit and vote for the ideas you like. The most voted ideas are the ones the team will pick up next.
        </p>
      </motion.div>

      <Card className="p-5 mb-6">
        <h2 className="font-bold mb-3">Share an idea</h2>
        {f.error && <Notice kind="error">{f.error}</Notice>}
        {f.ok && <Notice kind="ok">{f.ok}</Notice>}
        <form onSubmit={f.submit(null)}>
          <Field label="Title" required minLength={3} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI concierge for visitors" />
          <label className="block mb-3">
            <span className="text-xs text-mute">Explain the idea: the problem, who it is for and what we would build</span>
            <textarea className="field mt-1 min-h-28" required minLength={10} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <Button type="submit" loading={f.loading}>Submit idea</Button>
        </form>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">{ideas.length} {ideas.length === 1 ? "idea" : "ideas"}</h3>
        <div className="flex gap-2 text-sm">
          {(["top", "new"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`pill ${sort === s ? "pill-gold" : ""}`}>{s === "top" ? "Most voted" : "Newest"}</button>
          ))}
        </div>
      </div>

      <motion.div variants={stagger} className="grid gap-3">
        {ideas.map((i) => (
          <Card key={i.id} className="p-5 flex gap-4 items-start">
            <button onClick={() => toggle(i)} aria-pressed={i.voted} aria-label={i.voted ? "Remove vote" : "Vote for this idea"}
              className={`shrink-0 w-14 rounded-xl border py-2 text-center transition ${i.voted ? "bg-gradient-to-br from-violet to-cyan text-bg0 border-transparent" : "border-white/15 text-mute hover:text-ink"}`}>
              <span className="block text-lg leading-none">▲</span>
              <b className="block text-lg">{i.votes}</b>
            </button>
            <div className="min-w-0">
              <h4 className="font-bold">{i.title}</h4>
              <p className="text-sm text-mute mt-1 whitespace-pre-line break-words">{i.description}</p>
              <p className="text-xs text-mute mt-2">by {i.author_name}</p>
            </div>
          </Card>
        ))}
        {ideas.length === 0 && <p className="text-mute text-sm">No ideas yet. Be the first to add one.</p>}
      </motion.div>
    </motion.div>
  );
}
