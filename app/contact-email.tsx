"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CONTACT_EMAIL = "sparklelegalconsult@gmail.com";
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

export default function ContactEmail() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach((link) => {
      link.href = `mailto:${CONTACT_EMAIL}`;
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest("script, style")) continue;
      if (EMAIL_PATTERN.test(node.textContent || "")) nodes.push(node as Text);
      EMAIL_PATTERN.lastIndex = 0;
    }

    nodes.forEach((textNode) => {
      const value = textNode.textContent || "";
      const updated = value.replace(EMAIL_PATTERN, CONTACT_EMAIL);
      if (updated !== value) textNode.textContent = updated;
      EMAIL_PATTERN.lastIndex = 0;
    });
  }, [pathname]);

  return null;
}
