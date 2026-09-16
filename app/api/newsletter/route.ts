import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(request: Request) { const { email } = await request.json(); if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 }); await prisma.subscriber.upsert({ where: { email: email.toLowerCase() }, create: { email: email.toLowerCase() }, update: { active: true, consentAt: new Date() } }); return NextResponse.json({ ok: true }); }
