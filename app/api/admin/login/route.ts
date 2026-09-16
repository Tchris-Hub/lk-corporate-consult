import { NextResponse } from "next/server";
import { createSession, validPassword } from "@/lib/auth";
export async function POST(request: Request) { const { email, password } = await request.json(); if (email !== process.env.ADMIN_EMAIL || !validPassword(password)) return NextResponse.json({ error: "The email or password is incorrect." }, { status: 401 }); await createSession(); return NextResponse.json({ ok: true }); }
