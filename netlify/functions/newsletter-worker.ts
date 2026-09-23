import { prisma } from "../../lib/prisma";
import { NEWSLETTER_LIMIT } from "../../lib/newsletter";

export const config = { schedule: "@hourly" };

export default async function handler() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !(process.env.URL || process.env.NEXT_PUBLIC_SITE_URL)) return;
  const sentRecently = await prisma.newsletterDelivery.count({
    where: { status: "SENT", sentAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
  if (sentRecently >= NEWSLETTER_LIMIT) return;
  await fetch(new URL("/.netlify/functions/send-newsletter-background", process.env.NEXT_PUBLIC_SITE_URL), { method: "POST" }).catch(() => {});
}