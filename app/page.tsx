"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowRight, AtSign, BadgeCheck, BookOpen, Building2, ChevronLeft, ChevronRight, CirclePlay, Copyright, FileCheck2, Landmark, Menu, MoveUpRight, Play, Scale, Store, X } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";

const Youtube = CirclePlay;
const Instagram = AtSign;

const services = [
  { icon: Building2, eyebrow: "01 — ESTABLISH", title: "Legal Entity Registration", copy: "Business Names, Limited Liability Companies, NGOs and tailored incorporation support." },
  { icon: FileCheck2, eyebrow: "02 — MAINTAIN", title: "Post-Incorporation Services", copy: "Annual Returns, director and shareholder changes, share capital and statutory filings." },
  { icon: Copyright, eyebrow: "03 — PROTECT", title: "Intellectual Property", copy: "Trademark, copyright and patent support that puts your ideas on firmer ground." },
  { icon: Landmark, eyebrow: "04 — COMPLY", title: "SCUML & Export Licenses", copy: "Regulatory compliance and trade approvals for businesses ready to expand." },
  { icon: Scale, eyebrow: "05 — ADVISE", title: "Legal & Business Consultation", copy: "Clear advisory, risk management and operational structuring for decisive leaders." },
  { icon: Store, eyebrow: "06 — EQUIP", title: "Digital & Store Resources", copy: "Practical guides and digital business tools built for founders doing the work." },
];

const featuredVideos = [
  {
    id: "E6_u9gr2s9s",
    title: "The Most Misunderstood Business Term: Share Capital",
    tag: "BUSINESS STRUCTURING",
    embedUrl: "https://www.youtube-nocookie.com/embed/E6_u9gr2s9s?autoplay=1&rel=0",
    poster: "https://i.ytimg.com/vi/E6_u9gr2s9s/hqdefault.jpg",
  },
  {
    id: "nNVqpZ6UlMA",
    title: "Don't Start a Business Without This!",
    tag: "STARTING A BUSINESS",
    embedUrl: "https://www.youtube-nocookie.com/embed/nNVqpZ6UlMA?autoplay=1&rel=0",
    poster: "https://i.ytimg.com/vi/nNVqpZ6UlMA/hqdefault.jpg",
  },
  {
    id: "AGpCl5JvcC8",
    title: "40 Days of Legal & Finance Terms Every Business Owner Should Know",
    tag: "BUSINESS EDUCATION",
    embedUrl: "https://www.youtube-nocookie.com/embed/AGpCl5JvcC8?autoplay=1&rel=0",
    poster: "https://i.ytimg.com/vi/AGpCl5JvcC8/hqdefault.jpg",
  },
];

type Insight = { id: string; title: string; slug: string; excerpt: string; category: string; imageUrl?: string | null };

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) { const reduce = useReducedMotion(); return <m.div className={className} initial={reduce ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</m.div>; }

function VideoFacade() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const video = featuredVideos[activeIdx];

  const handleNext = () => { setPlaying(false); setActiveIdx((prev) => (prev + 1) % featuredVideos.length); };
  const handlePrev = () => { setPlaying(false); setActiveIdx((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length); };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-[1.7rem] bg-[#0a162c] shadow-2xl shadow-[#1b2a4a]/25">
        {playing ? (
          <iframe className="absolute inset-0 h-full w-full" src={video.embedUrl} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        ) : (
          <>
            <img src={video.poster} alt={`YouTube thumbnail: ${video.title}`} className="h-full w-full object-cover opacity-85 transition duration-500" referrerPolicy="strict-origin-when-cross-origin" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09152a]/90 via-[#09152a]/30 to-transparent" />
            <button onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`} className="group absolute inset-0 flex items-center justify-center">
              <span className="flex size-20 items-center justify-center rounded-full bg-[#d4af37] text-[#172845] shadow-xl transition duration-300 group-hover:scale-110">
                <Play fill="currentColor" className="ml-1 size-7" />
              </span>
            </button>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#f8d771]">{video.tag}</p>
                <p className="font-serif text-xl">{video.title}</p>
              </div>
              <span className="hidden rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs backdrop-blur sm:block">Watch video</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-[#1b2a4a]/10 bg-white/60 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          {featuredVideos.map((v, i) => (
            <button key={v.id} onClick={() => { setPlaying(false); setActiveIdx(i); }} className={`h-2.5 rounded-full transition-all ${i === activeIdx ? "w-8 bg-[#d4af37]" : "w-2.5 bg-[#1b2a4a]/20 hover:bg-[#1b2a4a]/40"}`} aria-label={`Go to video ${i + 1}`} />
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#1b2a4a]">
          <span>Video {activeIdx + 1} of {featuredVideos.length}</span>
          <button onClick={handlePrev} className="grid size-8 place-items-center rounded-full border border-[#1b2a4a]/20 hover:bg-[#1b2a4a]/10" aria-label="Previous video"><ChevronLeft className="size-4" /></button>
          <button onClick={handleNext} className="grid size-8 place-items-center rounded-full border border-[#1b2a4a]/20 hover:bg-[#1b2a4a]/10" aria-label="Next video"><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInsights(data);
      })
      .catch(() => {});
  }, []); return <LazyMotion features={domAnimation}><main className="overflow-hidden bg-[#f7f4ed] text-[#1b2a4a]">
  <header className="sticky top-0 z-30 border-b border-[#1b2a4a]/5 bg-[#f7f4ed]/95 shadow-sm shadow-[#1b2a4a]/5 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10"><a href="#home" className="flex items-center gap-3" aria-label="LK Corporate Consult home"><Image src="/brand/lk-mark.png" alt="LK Corporate Consult logo" width={44} height={44} priority className="size-11 rounded-full border border-[#d4af37]/50 object-cover" /><span className="leading-tight"><strong className="block font-serif text-base tracking-tight">Corporate</strong><span className="text-[10px] font-bold tracking-[0.19em] text-[#647086]">CONSULT</span></span></a><nav className="hidden items-center gap-7 text-sm font-semibold text-[#42516b] lg:flex">{["Home", "About", "Services", "Insights", "Contact"].map((item) => <a className="transition hover:text-[#b18a17]" href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}</nav><a href="#contact" className="hidden rounded-full bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#1b2a4a] transition hover:-translate-y-0.5 hover:bg-[#e1c25f] lg:block">Book Consultation</a><button onClick={() => setMenuOpen(!menuOpen)} className="grid size-11 place-items-center rounded-full border border-[#1b2a4a]/15 lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>{menuOpen && <nav className="absolute left-5 right-5 top-[76px] rounded-3xl border border-[#1b2a4a]/10 bg-[#fcfaf5] p-5 shadow-xl lg:hidden">{["Home", "About", "Services", "Insights", "Contact"].map((item) => <a onClick={() => setMenuOpen(false)} className="block border-b border-[#1b2a4a]/10 py-3 font-semibold last:border-0" href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}<a href="#contact" className="mt-3 block rounded-full bg-[#d4af37] px-4 py-3 text-center text-sm font-bold">Book Consultation</a></nav>}</div></header>
  <section id="home" className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 lg:px-10 lg:pt-20"><div className="absolute -right-28 top-0 size-[32rem] rounded-full border border-[#d4af37]/30" /><div className="absolute -right-14 top-14 size-[25rem] rounded-full border border-[#d4af37]/20" /><div className="relative grid items-end gap-12 lg:grid-cols-[1.08fr_.92fr]"><div><Reveal><p className="mb-7 flex items-center gap-2 text-xs font-bold tracking-[0.17em] text-[#9e7a16]"><span className="h-px w-8 bg-[#d4af37]" />CORPORATE ADVISORY · ABUJA, NIGERIA</p></Reveal><Reveal delay={0.08}><h1 className="max-w-3xl font-serif text-5xl leading-[.98] tracking-[-0.045em] text-[#172845] sm:text-6xl lg:text-7xl">Simplifying corporate compliance.<br /><em className="font-normal text-[#a47c10]">Supporting business growth.</em></h1></Reveal><Reveal delay={0.16}><p className="mt-7 max-w-xl text-base leading-8 text-[#536078] sm:text-lg">Expert corporate, CAC regulatory, legal, and business advisory services tailored for Nigerian entrepreneurs and growing companies.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3.5 font-bold text-[#172845] transition hover:-translate-y-0.5 hover:bg-[#e1c25f]">Book a Consultation <ArrowRight className="size-4 transition group-hover:translate-x-1" /></a><a href="#services" className="inline-flex items-center gap-2 rounded-full border border-[#1b2a4a]/40 px-6 py-3.5 font-bold transition hover:border-[#1b2a4a] hover:bg-white/60">Explore Services <ArrowDownRight className="size-4" /></a></div></Reveal></div><Reveal delay={0.18} className="relative mx-auto w-full max-w-md lg:max-w-none"><div className="relative aspect-[.83] overflow-hidden rounded-t-[12rem] rounded-bl-[2rem] rounded-br-[2rem] bg-[#d9d4c7]"><Image src="/images/boardroom.jpg" alt="LK Corporate Consult advisory meeting" fill priority sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover object-[58%_center]" /><div className="absolute inset-0 bg-gradient-to-t from-[#1b2a4a]/60 via-transparent to-transparent" /></div><div className="absolute -bottom-6 -left-3 rounded-2xl border border-white/60 bg-[#fcfaf5]/95 p-4 shadow-xl backdrop-blur sm:-left-8"><div className="flex items-center gap-3"><BadgeCheck className="size-8 text-[#b38b18]" /><p className="max-w-[11rem] text-xs font-semibold leading-5">Trusted across <strong>200+ CAC registrations</strong> & post-incorporation applications.</p></div></div></Reveal></div></section>
  <section id="about" className="bg-[#172845] px-5 py-20 text-[#f7f4ed] sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr]"><Reveal><p className="text-xs font-bold tracking-[.2em] text-[#d4af37]">THE FIRM</p><h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight sm:text-5xl">Guidance that makes the complex feel clear.</h2></Reveal><Reveal delay={0.1}><p className="max-w-2xl text-lg leading-8 text-[#d7dce5]">Built on a track record of thoughtful, client-first corporate guidance, LK Corporate Consult is the next chapter of Sparkle Legal Consult. We pair technical detail with plain-speaking advice, giving founders the confidence to move from ambition to action.</p><div className="mt-12 grid gap-4 sm:grid-cols-3">{[["01", "Professionalism"], ["02", "Integrity"], ["03", "Efficiency"]].map(([number, label]) => <div className="border-t border-[#d4af37]/60 pt-4" key={label}><span className="text-xs font-bold text-[#d4af37]">{number}</span><p className="mt-6 font-serif text-2xl">{label}</p></div>)}</div></Reveal></div></section>
  <section id="services" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><Reveal className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="text-xs font-bold tracking-[.2em] text-[#9e7a16]">WHAT WE DO</p><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">The right expertise, at every stage of your business.</h2></div><p className="max-w-xs text-sm leading-6 text-[#5d687b]">From first registration to the filings that keep you moving, our work is built around momentum.</p></Reveal><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map(({ icon: Icon, eyebrow, title, copy }, i) => <Reveal delay={(i % 3) * .07} key={title}><article className="group h-full rounded-[1.5rem] border border-[#1b2a4a]/10 bg-[#fcfaf5] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-xl hover:shadow-[#1b2a4a]/10"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#e9e2d2] text-[#1b2a4a]"><Icon className="size-5" /></span><MoveUpRight className="size-5 text-[#b38b18] opacity-0 transition group-hover:opacity-100" /></div><p className="mt-9 text-[10px] font-bold tracking-[.15em] text-[#9e7a16]">{eyebrow}</p><h3 className="mt-3 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[#58647a]">{copy}</p></article></Reveal>)}</div></section>
  <section className="border-y border-[#1b2a4a]/10 bg-[#e9e2d2] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.77fr_1.23fr]"><Reveal><p className="text-xs font-bold tracking-[.2em] text-[#9e7a16]">MEDIA & ECOSYSTEM</p><h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Advice that travels further than the meeting room.</h2><p className="mt-6 max-w-md leading-7 text-[#566177]">Explore concise, founder-first lessons on CAC registration, legal compliance and building with clarity on <strong>Easy Bits with Lana.</strong></p><div className="mt-8 flex flex-wrap gap-3"><a className="inline-flex items-center gap-2 rounded-full bg-[#172845] px-5 py-3 font-bold text-white transition hover:bg-[#263b63]" href="https://www.youtube.com/@EasyBitswithLana" target="_blank" rel="noreferrer"><Youtube className="size-4" /> Visit YouTube</a><a className="inline-flex items-center gap-2 rounded-full border border-[#1b2a4a]/25 px-5 py-3 font-bold transition hover:bg-white/50" href="https://selar.com/m/easybitswithlana" target="_blank" rel="noreferrer"><Store className="size-4" /> Explore Selar store</a></div></Reveal><Reveal delay={.12}><VideoFacade /></Reveal></div></section>
  <section id="insights" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><Reveal><p className="text-xs font-bold tracking-[.2em] text-[#9e7a16]">INSIGHTS</p><div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><h2 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">Latest Regulatory Insights & Business Guides</h2><a href="/blog" className="inline-flex items-center gap-1 font-bold text-[#1b2a4a] hover:text-[#9e7a16]">View all insights <ChevronRight className="size-4" /></a></div></Reveal>{insights.length ? <div className="mt-12 grid gap-5 lg:grid-cols-3">{insights.map((insight, i) => <Reveal delay={i * .09} key={insight.id}><article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1b2a4a]/10">{insight.imageUrl && <div className="-mx-6 -mt-6 mb-5 aspect-video overflow-hidden bg-gray-100"><img src={insight.imageUrl} alt={insight.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div>}<span className="w-fit rounded-full bg-[#e9e2d2] px-3 py-1 text-[10px] font-bold tracking-[.1em] text-[#80620f]">{insight.category}</span><h3 className="mt-4 font-serif text-2xl leading-snug">{insight.title}</h3><p className="mt-3 text-sm leading-6 text-[#5b667a]">{insight.excerpt}</p><a href={`/blog/${insight.slug}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#1b2a4a]">Read Article <ArrowRight className="size-4 transition group-hover:translate-x-1" /></a></article></Reveal>)}</div> : <Reveal><div className="mt-12 grid min-h-48 place-items-center rounded-[1.5rem] border border-dashed border-[#172845]/20 text-center"><div><BookOpen className="mx-auto size-8 text-[#b38b18]" /><h3 className="mt-4 font-serif text-3xl">Insights are on their way.</h3><p className="mt-2 text-[#566177]">Check back soon for clear, actionable business guidance.</p></div></div></Reveal>}</section>
  <footer id="contact" className="bg-[#172845] px-5 pb-7 pt-16 text-[#f7f4ed] sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-12 border-b border-white/15 pb-14 lg:grid-cols-[1.25fr_.75fr_.75fr]"><Reveal><p className="text-xs font-bold tracking-[.2em] text-[#d4af37]">LET’S MAKE IT OFFICIAL</p><h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight sm:text-5xl">Your next move deserves a clear path forward.</h2><a href="https://wa.me/2347034930571" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3.5 font-bold text-[#172845] transition hover:bg-[#e1c25f]">Book a Consultation <ArrowRight className="size-4" /></a></Reveal><div><p className="text-xs font-bold tracking-[.16em] text-[#d4af37]">CONTACT</p><a href="tel:07034930571" className="mt-5 block font-serif text-xl hover:text-[#d4af37]">07034930571</a><a href="mailto:lkcorporateconsult@gmail.com" className="mt-3 block break-all text-sm text-[#d7dce5] hover:text-[#d4af37]">lkcorporateconsult@gmail.com</a></div><div><p className="text-xs font-bold tracking-[.16em] text-[#d4af37]">OFFICE</p><address className="mt-5 max-w-52 text-sm not-italic leading-7 text-[#d7dce5]">No 12 Army Post Housing Estate, Kurudu, Abuja, FCT, Nigeria.</address></div></div><div className="flex flex-col justify-between gap-5 py-7 text-xs text-[#aeb7c6] sm:flex-row sm:items-center"><p>© {new Date().getFullYear()} LK Corporate Consult. All rights reserved.</p><div className="flex items-center gap-5"><a className="hover:text-[#d4af37]" href="https://instagram.com/easyb_withlana" target="_blank" rel="noreferrer"><Instagram className="size-4" /><span className="sr-only">Instagram</span></a><a className="hover:text-[#d4af37]" href="https://www.youtube.com/@EasyBitswithLana" target="_blank" rel="noreferrer"><Youtube className="size-4" /><span className="sr-only">YouTube</span></a><a className="hover:text-[#d4af37]" href="https://selar.com/m/easybitswithlana" target="_blank" rel="noreferrer"><BookOpen className="size-4" /><span className="sr-only">Selar</span></a></div></div></div></footer>
</main></LazyMotion>; }
