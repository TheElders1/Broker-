"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal. Content is visible by default
 * (see .reveal in globals.css) — this only ever *adds* a temporary hidden
 * state to elements that are confirmed below the fold at mount, then
 * reveals them via IntersectionObserver. If the observer is unsupported,
 * never fires for some element (seen on some mobile browsers on very
 * tall pages), or JS is slow/blocked, a timeout fallback forces every
 * pending element visible — content can never get stuck invisible.
 */
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const pending = els.filter((el) => el.getBoundingClientRect().top > viewportHeight * 0.9);
    if (pending.length === 0) return;

    pending.forEach((el) => el.classList.add("reveal-pending"));

    const reveal = (el: Element) => {
      el.classList.add("in-view");
      el.classList.remove("reveal-pending");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    pending.forEach((el) => observer.observe(el));

    // Safety net: guarantee visibility even if the observer misses an
    // element (tall pages, backgrounded tabs, unusual browser behavior).
    const fallback = window.setTimeout(() => {
      pending.forEach(reveal);
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
