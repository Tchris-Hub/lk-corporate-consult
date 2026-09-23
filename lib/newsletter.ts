import nodemailer from "nodemailer";
import { SignJWT, jwtVerify } from "jose";

const siteUrl = () => process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "https://lk-corporate-consult.netlify.app";
export const NEWSLETTER_LIMIT = Number(process.env.GMAIL_DAILY_LIMIT || 500);

function secretKey() {
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export function createTransporter() {
  const user = process.env.GMAIL_USER || process.env.ADMIN_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  });
}

export async function createUnsubscribeToken(subscriberId: string) {
  return new SignJWT({ sub: subscriberId, purpose: "newsletter-unsubscribe" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(secretKey());
}

export async function verifyUnsubscribeToken(token: string) {
  try {
    const result = await jwtVerify(token, secretKey());
    if (result.payload.purpose !== "newsletter-unsubscribe" || typeof result.payload.sub !== "string") return null;
    return result.payload.sub;
  } catch {
    return null;
  }
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl()).toString();
}

export async function sendNewsletterMessage(to: string, post: { title: string; excerpt: string; slug: string; category: string; imageUrl?: string | null }, subscriberId: string) {
  const transporter = createTransporter();
  if (!transporter) throw new Error("Newsletter email is not configured.");
  const unsubscribeToken = await createUnsubscribeToken(subscriberId);
  const unsubscribeUrl = absoluteUrl("/api/newsletter/unsubscribe?token=" + encodeURIComponent(unsubscribeToken));
  const articleUrl = absoluteUrl("/blog/" + post.slug);
  const from = process.env.GMAIL_USER || process.env.ADMIN_EMAIL;
  const safeTitle = post.title.replace(/[<>]/g, "");
  const safeExcerpt = post.excerpt.replace(/[<>]/g, "");

  await transporter.sendMail({
    from: "\"LK Corporate Consult\" <" + from + ">",
    to,
    subject: "New insight from LK Corporate Consult: " + safeTitle,
    text: safeTitle + "\n\n" + safeExcerpt + "\n\nRead the full article: " + articleUrl + "\n\nUnsubscribe: " + unsubscribeUrl,
    html: "<!doctype html><html><body style=\"margin:0;background:#f7f4ed;color:#172845;font-family:Arial,sans-serif\"><div style=\"max-width:620px;margin:0 auto;padding:36px 20px\"><div style=\"background:#172845;color:#f7f4ed;border-radius:24px;padding:32px\"><p style=\"margin:0;color:#d4af37;font-size:11px;font-weight:700;letter-spacing:2px\">LK CORPORATE CONSULT · " + post.category + "</p><h1 style=\"font-family:Georgia,serif;font-size:34px;line-height:1.15;margin:18px 0\">" + safeTitle + "</h1><p style=\"color:#d7dce5;font-size:16px;line-height:1.7\">" + safeExcerpt + "</p><a href=\"" + articleUrl + "\" style=\"display:inline-block;margin-top:12px;background:#d4af37;color:#172845;text-decoration:none;font-weight:700;padding:13px 20px;border-radius:999px\">Read the insight</a></div><p style=\"font-size:12px;line-height:1.6;color:#68748a;margin:20px 4px\">You received this because you subscribed to LK Corporate Consult updates. <a href=\"" + unsubscribeUrl + "\" style=\"color:#172845\">Unsubscribe</a>.</p></div></body></html>",
    headers: {
      "List-ID": "<lk-corporate-consult-newsletter>",
      "List-Unsubscribe": "<" + unsubscribeUrl + ">",
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}