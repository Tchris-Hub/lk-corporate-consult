import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/newsletter";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const subscriberId = await verifyUnsubscribeToken(token);
  if (!subscriberId) return new NextResponse("Invalid or expired unsubscribe link.", { status: 400 });
  await prisma.subscriber.update({ where: { id: subscriberId }, data: { active: false } });
  return new NextResponse("<!doctype html><html><body style=\"font-family:Arial,sans-serif;padding:48px;text-align:center\"><h1>You’re unsubscribed.</h1><p>You will no longer receive LK Corporate Consult newsletter alerts.</p></body></html>", { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const token = new URL(request.url).searchParams.get("token") || "";
  if (form?.get("List-Unsubscribe") !== "One-Click") return NextResponse.json({ error: "Invalid unsubscribe request." }, { status: 400 });
  const subscriberId = await verifyUnsubscribeToken(token);
  if (!subscriberId) return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 400 });
  await prisma.subscriber.update({ where: { id: subscriberId }, data: { active: false } });
  return new NextResponse(null, { status: 204 });
}