import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleEditor } from "@/app/lana/posts/editor";
export const dynamic = "force-dynamic";
export default async function EditPost({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); const { id } = await params; const post = await prisma.post.findUnique({ where: { id } }); if (!post) notFound(); return <ArticleEditor post={post} />; }
