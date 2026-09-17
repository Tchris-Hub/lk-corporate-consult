import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const clientName = String(body.clientName || "").trim();
  const role = String(body.role || "").trim() || null;
  const company = String(body.company || "").trim() || null;
  const content = String(body.content || "").trim();
  const published = body.published !== false;
  if (!clientName || !content) return NextResponse.json({ error: "Client name and review are required." }, { status: 400 });
  const review = await prisma.review.create({ data: { clientName, role, company, content, published } });
  return NextResponse.json({ review });
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const id = String(body.id || "").trim();
  if (!id) return NextResponse.json({ error: "Review id is required." }, { status: 400 });
  const review = await prisma.review.update({
    where: { id },
    data: {
      clientName: String(body.clientName || "").trim(),
      role: String(body.role || "").trim() || null,
      company: String(body.company || "").trim() || null,
      content: String(body.content || "").trim(),
      published: body.published !== false,
    },
  });
  return NextResponse.json({ review });
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Review id is required." }, { status: 400 });
  await prisma.review.delete({ where: { id: String(id) } });
  return NextResponse.json({ ok: true });
}
