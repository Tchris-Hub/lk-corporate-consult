"use client";

import { useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Review = { id: string; clientName: string; role: string | null; company: string | null; content: string; published: boolean };
const emptyForm = { clientName: "", role: "", company: "", content: "", published: true };

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function edit(review: Review) { setEditingId(review.id); setShowForm(true); setForm({ clientName: review.clientName, role: review.role || "", company: review.company || "", content: review.content, published: review.published }); setError(""); }
  function addNew() { setEditingId(null); setForm(emptyForm); setShowForm(true); setError(""); }
  function reset() { setEditingId(null); setShowForm(false); setForm(emptyForm); setError(""); }
  async function save() {
    setBusy(true); setError("");
    const response = await fetch("/api/lana/reviews", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { ...form, id: editingId } : form) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setError(data.error || "Could not save the review.");
    if (editingId) setReviews((current) => current.map((review) => review.id === editingId ? data.review : review)); else setReviews((current) => [data.review, ...current]);
    reset(); router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this client review permanently?")) return;
    setBusy(true); await fetch("/api/lana/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setReviews((current) => current.filter((review) => review.id !== id)); setBusy(false); router.refresh();
  }
  return <section className="mt-10 rounded-[1.5rem] bg-white p-5 sm:p-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.18em] text-[#9e7a16]">CLIENT REVIEWS</p><h2 className="mt-2 font-serif text-3xl">Testimonials</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#68748a]">Add, edit, publish or hide client reviews. The website automatically shows the latest three and puts the rest behind “View all reviews”.</p></div>{!showForm && <button onClick={addNew} className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-bold"><Plus className="size-4" /> Add review</button>}</div>
    {showForm && <div className="mt-7 rounded-2xl border border-[#172845]/10 bg-[#f7f4ed] p-5"><div className="flex items-center justify-between"><h3 className="font-serif text-2xl">{editingId ? "Edit review" : "New client review"}</h3><button onClick={reset} aria-label="Close"><X className="size-5" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><label className="text-sm font-bold">Client name<input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="mt-2 w-full rounded-xl border border-[#172845]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#d4af37]" placeholder="e.g. Ada Okafor" /></label><label className="text-sm font-bold">Role<input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-2 w-full rounded-xl border border-[#172845]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#d4af37]" placeholder="Founder / Director" /></label><label className="text-sm font-bold">Company<input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-2 w-full rounded-xl border border-[#172845]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#d4af37]" placeholder="Company name" /></label></div><label className="mt-4 block text-sm font-bold">Review<textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="mt-2 w-full rounded-xl border border-[#172845]/15 bg-white px-4 py-3 font-normal leading-7 outline-none focus:border-[#d4af37]" placeholder="What did the client say about their experience?" /></label><label className="mt-4 flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="size-4 accent-[#d4af37]" /> Show on website</label>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}<button disabled={busy} onClick={save} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 font-bold disabled:opacity-60"><Save className="size-4" /> {editingId ? "Save changes" : "Add review"}</button></div>}
    <div className="mt-7 divide-y divide-[#172845]/10">{reviews.length ? reviews.map((review) => <article key={review.id} className="flex flex-wrap items-start justify-between gap-5 py-5"><div className="max-w-3xl"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#e9e2d2] px-2 py-1 text-[10px] font-bold tracking-wider">{review.published ? "VISIBLE" : "HIDDEN"}</span>{review.role && <span className="rounded-full bg-[#172845]/8 px-2 py-1 text-[10px] font-bold tracking-wider">{review.role}</span>}</div><h3 className="mt-3 font-serif text-xl">{review.clientName}{review.company ? <span className="font-sans text-sm font-normal text-[#68748a]"> · {review.company}</span> : null}</h3><p className="mt-2 text-sm leading-6 text-[#68748a]">“{review.content}”</p></div><div className="flex gap-2"><button onClick={() => edit(review)} className="inline-flex items-center gap-2 rounded-full border border-[#172845]/20 px-4 py-2 text-sm font-bold"><Pencil className="size-4" /> Edit</button><button disabled={busy} onClick={() => remove(review.id)} className="grid size-9 place-items-center rounded-full text-red-700 hover:bg-red-50" aria-label="Delete review"><Trash2 className="size-4" /></button></div></article>) : <p className="py-12 text-center text-[#68748a]">No client reviews yet. Add the first one above.</p>}</div>
  </section>;
}
