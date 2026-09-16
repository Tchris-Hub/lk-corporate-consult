import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, category: true, imageUrl: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json([], { status: 500 });
  }
}
