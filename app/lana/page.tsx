import Link from "next/link";
import { FilePenLine, Plus, Users, MessageSquareQuote } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewsManager } from "./reviews-manager";

export const dynamic = "force-dynamic";

export default async function Admin() {
  await requireAdmin();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const quotaLimit = Number(process.env.GMAIL_DAILY_LIMIT || 500);
  const [posts, subscribers, reviews, sentLast24h, pendingDeliveries] = await Promise.all([
    prisma.post.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.subscriber.count({ where: { active: true } }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.newsletterDelivery.count({ where: { status: "SENT", sentAt: { gte: since } } }),
    prisma.newsletterDelivery.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <main className="min-h-screen bg-[#f1eee6] p-5 text-[#172845] sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-5">
          <div><p className="text-xs font-bold tracking-[.2em] text-[#9e7a16]">LK CORPORATE CONSULT</p><h1 className="mt-2 font-serif text-4xl">Lana dashboard</h1></div>
          <div className="flex gap-3"><Link href="/" className="rounded-full border border-[#172845]/20 px-5 py-3 text-sm font-bold">View site</Link><Link href="/lana/posts/new" className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-bold"><Plus className="size-4" /> New article</Link></div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-[#172845] p-6 text-white"><FilePenLine className="size-5 text-[#d4af37]" /><p className="mt-8 text-4xl font-serif">{posts.length}</p><p className="mt-1 text-sm text-[#c7cfdb]">Articles in your library</p></div>
          <div className="rounded-3xl bg-white p-6"><Users className="size-5 text-[#b38b18]" /><p className="mt-8 text-4xl font-serif">{subscribers}</p><p className="mt-1 text-sm text-[#5b667a]">Opted-in regulatory subscribers</p></div>
          <div className="rounded-3xl bg-white p-6"><MessageSquareQuote className="size-5 text-[#b38b18]" /><p className="mt-8 text-4xl font-serif">{reviews.length}</p><p className="mt-1 text-sm text-[#5b667a]">Client reviews</p></div>
          <div className="rounded-3xl bg-white p-6"><p className="text-xs font-bold tracking-[.16em] text-[#9e7a16]">EMAIL QUOTA</p><div className="mt-5 flex items-end justify-between gap-3"><p className="font-serif text-3xl">{Math.min(sentLast24h, quotaLimit)} <span className="text-base text-[#68748a]">/ {quotaLimit}</span></p><span className="text-xs font-bold text-[#68748a]">last 24h</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e9e2d2]"><div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${Math.min(100, (sentLast24h / quotaLimit) * 100)}%` }} /></div><p className="mt-3 text-xs leading-5 text-[#68748a]">{pendingDeliveries} newsletter alert{pendingDeliveries === 1 ? "" : "s"} waiting to send. This is the site-tracked safety budget, not a live Google account meter.</p></div>
        </section>

        <section className="mt-10 rounded-[1.5rem] bg-white p-5 sm:p-7">
          <div className="flex items-end justify-between"><div><p className="text-xs font-bold tracking-[.18em] text-[#9e7a16]">CONTENT LIBRARY</p><h2 className="mt-2 font-serif text-3xl">Your articles</h2></div></div>
          <div className="mt-7 divide-y divide-[#172845]/10">{posts.length ? posts.map(post => <div className="flex flex-wrap items-center justify-between gap-4 py-5" key={post.id}><div><div className="flex gap-2"><span className="rounded-full bg-[#e9e2d2] px-2 py-1 text-[10px] font-bold tracking-wider">{post.category}</span><span className="rounded-full bg-[#172845]/8 px-2 py-1 text-[10px] font-bold tracking-wider">{post.status}</span></div><h3 className="mt-3 font-serif text-xl">{post.title}</h3><p className="mt-1 text-xs text-[#68748a]">Last updated {post.updatedAt.toLocaleDateString("en-NG")}</p></div><Link href={`/lana/posts/${post.id}`} className="rounded-full border border-[#172845]/20 px-4 py-2 text-sm font-bold">Edit</Link></div>) : <p className="py-12 text-center text-[#68748a]">No articles yet. Your next insight starts here.</p>}</div>
        </section>

        <ReviewsManager initialReviews={reviews.map(({ id, clientName, role, company, content, published }) => ({ id, clientName, role, company, content, published }))} />
      </div>
    </main>
  );
}
