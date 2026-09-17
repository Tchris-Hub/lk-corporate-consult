"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ABOUT_TITLE = "About LK Corporate Consult";
const ABOUT_COPY = [
  "LK Corporate Consult is a Nigerian corporate and legal consultancy firm registered with the Corporate Affairs Commission (CAC). Formerly known as Sparkle Legal Consult, the firm has evolved into LK Corporate Consult with a renewed focus on providing professional, efficient and client-focused corporate, legal and business advisory services.",
  "With experience in over 200 business registrations and post-incorporation applications, we assist entrepreneurs, companies, organisations and investors with the legal and regulatory processes required to establish, maintain and grow their businesses in Nigeria.",
  "Our approach is centred on providing practical, reliable and timely solutions. We simplify complex regulatory and corporate processes and guide our clients through each stage with professionalism and attention to detail.",
];

type Review = { clientName: string; role?: string | null; company?: string | null; content: string };

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function reviewCard(review: Review) {
  const card = el("article", "rounded-[1.5rem] border border-[#1b2a4a]/10 bg-[#fcfaf5] p-6 shadow-sm");
  const quote = el("div", "text-4xl font-serif leading-none text-[#d4af37]"); quote.textContent = "“";
  const body = el("p", "mt-3 text-base leading-7 text-[#536078]"); body.textContent = review.content;
  const name = el("p", "mt-6 font-serif text-xl text-[#172845]"); name.textContent = review.clientName;
  const meta = el("p", "mt-1 text-xs font-semibold tracking-wide text-[#7b8494]"); meta.textContent = [review.role, review.company].filter(Boolean).join(" · ");
  card.append(quote, body, name); if (meta.textContent) card.append(meta);
  return card;
}

function buildReviewsSection(reviews: Review[]) {
  const section = document.querySelector<HTMLElement>("#reviews") || Array.from(document.querySelectorAll<HTMLElement>("section")).find((node) => /review|testimonial/i.test(node.textContent || ""));
  const target = section || el("section");
  if (!section) { target.id = "reviews"; target.className = "mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"; const main = document.querySelector("main"); const about = document.querySelector("#about"); if (main && about) main.insertBefore(target, about.nextElementSibling); }
  target.innerHTML = "";
  const wrap = el("div", "mx-auto max-w-7xl");
  const header = el("div", "flex flex-col justify-between gap-6 md:flex-row md:items-end");
  const eyebrow = el("p", "text-xs font-bold tracking-[.2em] text-[#9e7a16]"); eyebrow.textContent = "CLIENT REVIEWS";
  const title = el("h2", "mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl"); title.textContent = "What our clients say";
  const intro = el("p", "max-w-md text-sm leading-6 text-[#5d687b]"); intro.textContent = "Real experiences from clients we have supported through their corporate and regulatory journeys.";
  const heading = el("div"); heading.append(eyebrow, title); header.append(heading, intro);
  const grid = el("div", "mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3");
  reviews.slice(0, 3).forEach((review) => grid.append(reviewCard(review)));
  wrap.append(header);
  if (reviews.length) wrap.append(grid); else { const empty = el("p", "mt-12 rounded-[1.5rem] border border-dashed border-[#1b2a4a]/15 p-10 text-center text-[#68748a]"); empty.textContent = "Client reviews will appear here soon."; wrap.append(empty); }

  if (reviews.length > 3) {
    const button = el("button", "mx-auto mt-8 block rounded-full border border-[#172845]/30 px-6 py-3 text-sm font-bold text-[#172845] transition hover:bg-white/70"); button.textContent = "View all reviews";
    const overlay = el("div", "fixed inset-0 z-[80] hidden items-center justify-center bg-[#09152a]/70 p-5 backdrop-blur-sm");
    const modal = el("div", "max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-[#f7f4ed] shadow-2xl");
    const modalHead = el("div", "flex items-center justify-between border-b border-[#172845]/10 px-6 py-5 sm:px-8");
    const modalTitle = el("h3", "font-serif text-3xl text-[#172845]"); modalTitle.textContent = "All client reviews";
    const close = el("button", "grid size-10 place-items-center rounded-full border border-[#172845]/15 text-xl"); close.textContent = "×";
    const list = el("div", "grid max-h-[70vh] gap-4 overflow-y-auto p-6 sm:grid-cols-2 sm:p-8"); reviews.forEach((review) => list.append(reviewCard(review)));
    modalHead.append(modalTitle, close); modal.append(modalHead, list); overlay.append(modal); document.body.append(overlay);
    const open = () => { overlay.classList.remove("hidden"); overlay.classList.add("flex"); document.body.style.overflow = "hidden"; };
    const dismiss = () => { overlay.classList.add("hidden"); overlay.classList.remove("flex"); document.body.style.overflow = ""; };
    button.addEventListener("click", open); close.addEventListener("click", dismiss); overlay.addEventListener("click", (event) => { if (event.target === overlay) dismiss(); });
    wrap.append(button);
  }
  target.append(wrap);
}

export default function SiteEnhancements() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") return;
    const about = document.querySelector<HTMLElement>("#about");
    if (about) {
      const title = about.querySelector("h2"); if (title) title.textContent = ABOUT_TITLE;
      const copy = about.querySelector("p.max-w-2xl");
      if (copy) { copy.innerHTML = ""; ABOUT_COPY.forEach((paragraph, index) => { const p = document.createElement("span"); p.className = "block"; p.textContent = paragraph; if (index > 0) p.classList.add("mt-6"); copy.append(p); }); }
    }

    const floating = el("a", "fixed bottom-6 right-5 z-[70] grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:scale-105 sm:bottom-8 sm:right-8");
    floating.setAttribute("href", "#contact"); floating.setAttribute("aria-label", "Contact LK Corporate Consult on WhatsApp"); floating.title = "Chat with LK Corporate Consult on WhatsApp";
    floating.innerHTML = '<svg viewBox="0 0 32 32" class="size-7" fill="currentColor" aria-hidden="true"><path d="M19.11 17.19c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.33-1.56-1.49-1.82-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.64 1.11 2.82c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.57.65.21 1.24.18 1.71.11.52-.08 1.58-.65 1.8-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32ZM16.03 3.2a12.8 12.8 0 0 0-10.9 19.5L3.2 28.8l6.27-1.89A12.8 12.8 0 1 0 16.03 3.2Zm0 23.35c-2.04 0-4.04-.55-5.78-1.6l-.41-.25-3.72 1.12 1.14-3.62-.27-.42a10.67 10.67 0 1 1 9.04 4.77Z"/></svg>';
    floating.addEventListener("click", (event) => { const whatsapp = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"], a[href*="whatsapp"]')).find((link) => link !== floating); if (whatsapp) { event.preventDefault(); window.location.href = whatsapp.href; } });
    document.body.append(floating);

    fetch("/api/lana/reviews").then((response) => response.ok ? response.json() : []).then((reviews) => { if (Array.isArray(reviews)) buildReviewsSection(reviews); }).catch(() => {});

    return () => { floating.remove(); document.querySelectorAll("body > div").forEach((node) => { if (node.classList.contains("fixed") && node.classList.contains("z-[80]")) node.remove(); }); };
  }, [pathname]);
  return null;
}
