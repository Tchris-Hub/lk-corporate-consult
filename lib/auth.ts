import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { scryptSync, timingSafeEqual } from "node:crypto";

const name = "lk_admin";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);

export async function createSession() {
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(key());
  (await cookies()).set(name, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}
export async function hasAdminSession() {
  try { const token = (await cookies()).get(name)?.value; if (!token || !process.env.AUTH_SECRET) return false; const result = await jwtVerify(token, key()); return result.payload.role === "admin"; } catch { return false; }
}
export async function requireAdmin() { if (!(await hasAdminSession())) redirect("/admin/login"); }
export async function clearSession() { (await cookies()).delete(name); }
export function validPassword(password: string) {
  const value = process.env.ADMIN_PASSWORD_HASH;
  if (!value?.startsWith("scrypt$")) return false;
  const [, salt, expected] = value.split("$");
  const actual = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}
