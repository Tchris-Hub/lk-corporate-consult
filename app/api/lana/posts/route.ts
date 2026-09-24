import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const title = String(body.title || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  const content = String(body.content || "").trim();
  const category = String(body.category || "").trim();
  const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  if (!title || !excerpt || !content || !category) return NextResponse.json({ error: "Complete every field before saving." }, { status: 400 });
  const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const baseSlug = slugify(body.slug || title);
  if (!baseSlug) return NextResponse.json({ error: "Add a title that can be used to create the article URL." }, { status: 400 });
  const count = await prisma.post.count({ where: { slug: { startsWith: baseSlug } } });
  const post = await prisma.post.create({ data: { title, slug: count ? `${baseSlug}-${count + 1}` : baseSlug, excerpt, content, category, imageUrl, status, publishedAt: status === "PUBLISHED" ? new Date() : null } });
  if (status === "PUBLISHED") {
    const subscribers = await prisma.subscriber.findMany({ where: { active: true }, select: { id: true } });
    if (subscribers.length) await prisma.newsletterDelivery.createMany({ data: subscribers.map((subscriber) => ({ postId: post.id, subscriberId: subscriber.id })), skipDuplicates: true });
    fetch(new URL("/.netlify/functions/send-newsletter-background", request.url), { method: "POST" }).catch(() => {});
  }
  return NextResponse.json({ post });
}