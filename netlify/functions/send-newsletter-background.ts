import { prisma } from "../../lib/prisma";
import { NEWSLETTER_LIMIT, sendNewsletterMessage } from "../../lib/newsletter";

export const config = { background: true };

export default async function handler() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Newsletter worker skipped: GMAIL_USER/GMAIL_APP_PASSWORD is not configured.");
    return;
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sentRecently = await prisma.newsletterDelivery.count({ where: { status: "SENT", sentAt: { gte: since } } });
  let remaining = Math.max(0, NEWSLETTER_LIMIT - sentRecently);
  if (!remaining) return;

  while (remaining > 0) {
    const delivery = await prisma.newsletterDelivery.findFirst({
      where: { status: "PENDING", subscriber: { active: true }, post: { status: "PUBLISHED" } },
      orderBy: { createdAt: "asc" },
      include: { subscriber: true, post: true },
    });
    if (!delivery) break;

    const claimed = await prisma.newsletterDelivery.updateMany({
      where: { id: delivery.id, status: "PENDING" },
      data: { status: "PROCESSING", error: null },
    });
    if (claimed.count !== 1) continue;

    try {
      await sendNewsletterMessage(delivery.subscriber.email, delivery.post, delivery.subscriberId);
      await prisma.newsletterDelivery.update({ where: { id: delivery.id }, data: { status: "SENT", sentAt: new Date(), error: null } });
      remaining -= 1;
    } catch (error) {
      await prisma.newsletterDelivery.update({
        where: { id: delivery.id },
        data: { status: "FAILED", error: error instanceof Error ? error.message.slice(0, 2000) : "Unknown email error" },
      });
    }
  }
}