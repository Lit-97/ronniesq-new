"use client";

import { useEffect } from "react";

export default function AboutReveal() {
  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-about-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            target.classList.add("is-visible");
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.16,
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return null;
}