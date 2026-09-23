"use client";
import { FormEvent, useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "lk-newsletter-popup-seen-v1";
const REMINDER_DAYS = 14;

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      const seen = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (!seen || Date.now() - seen > REMINDER_DAYS * 86400000) {
        const timer = window.setTimeout(() => setOpen(true), 350);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setOpen(true), 350);
      return () => window.clearTimeout(timer);
    }
  }, [pathname]);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      setStatus("success");
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
    } catch {
      setStatus("error");
    }
  };

  if (pathname !== "/" || !open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09152a]/65 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="newsletter-title">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#f7f4ed] p-7 text-[#172845] shadow-2xl sm:p-9">
        <button type="button" onClick={dismiss} className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-[#172845]/15" aria-label="Close newsletter sign-up"><X className="size-5" /></button>
        {status === "success" ? (
          <div className="pt-5 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#e9e2d2] text-[#9e7a16]"><Mail className="size-6" /></div>
            <h2 className="mt-6 font-serif text-3xl">You’re on the list.</h2>
            <p className="mt-3 leading-7 text-[#5b667a]">We’ll send LK Corporate Consult’s latest regulatory insights and business guides to your inbox.</p>
            <button type="button" onClick={dismiss} className="mt-7 rounded-full bg-[#d4af37] px-6 py-3 font-bold">Continue to site</button>
          </div>
        ) : (
          <>
            <div className="grid size-12 place-items-center rounded-2xl bg-[#172845] text-[#d4af37]"><Mail className="size-5" /></div>
            <p className="mt-7 text-xs font-bold tracking-[.2em] text-[#9e7a16]">LK CORPORATE CONSULT</p>
            <h2 id="newsletter-title" className="mt-3 max-w-sm font-serif text-4xl leading-tight">Stay informed. Stay ahead.</h2>
            <p className="mt-4 leading-7 text-[#5b667a]">Get new regulatory insights, business guides and important updates from LK Corporate Consult.</p>
            <form onSubmit={submit} className="mt-7">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" required className="w-full rounded-2xl border border-[#172845]/15 bg-white px-4 py-4 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20" />
              <button disabled={status === "saving"} className="mt-3 w-full rounded-full bg-[#d4af37] px-6 py-4 font-bold text-[#172845] disabled:opacity-60">{status === "saving" ? "Joining…" : "Join the newsletter"}</button>
              {status === "error" && <p className="mt-3 text-sm text-red-700">We couldn’t save your email. Please try again.</p>}
              <p className="mt-4 text-center text-xs leading-5 text-[#788297]">By subscribing, you agree to receive LK Corporate Consult updates. You can unsubscribe at any time.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}