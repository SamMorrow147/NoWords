"use client";

import { useEffect, useRef } from "react";

const SECTION_THREE_IMAGE =
  "/freepik__close-up-product-shot-of-this-necklace-swinging-ou__60531.png";

export default function SectionThreeText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const sectionThree = document.getElementById("section-three");
    const sectionFour = document.getElementById("section-four");
    if (!el || !sectionThree || !sectionFour) return;

    let rafId: number;
    let lastOpacity = 0;

    function tick() {
      const vh = window.innerHeight;
      const s3Top = sectionThree!.getBoundingClientRect().top;
      const s4Top = sectionFour!.getBoundingClientRect().top;

      // Fade in: section-three top from -5% → -25% of viewport
      const inStart = vh * -0.05;
      const inEnd = vh * -0.25;

      // Fade out: section-four top from 100% → 85% of viewport
      const outStart = vh;
      const outEnd = vh * 0.85;

      let opacity = 0;

      if (s4Top <= outEnd) {
        opacity = 0;
      } else if (s4Top < outStart) {
        opacity = (s4Top - outEnd) / (outStart - outEnd);
      } else if (s3Top <= inEnd) {
        opacity = 1;
      } else if (s3Top < inStart) {
        opacity = 1 - (s3Top - inEnd) / (inStart - inEnd);
      }

      opacity = Math.max(0, Math.min(1, opacity));

      if (Math.abs(opacity - lastOpacity) > 0.001) {
        el!.style.opacity = String(opacity);
        lastOpacity = opacity;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={textRef}
      className="fixed inset-0 flex items-end justify-end pr-[8vw] pb-[12vh] md:pb-[6vh] xl:pb-[2vh] z-[40] pointer-events-none"
      style={{
        opacity: 0,
        fontFamily: "'Abject Failure', sans-serif",
        fontSize: "clamp(7rem, 14vw, 16rem)",
        fontWeight: 600,
        backgroundImage: `url(${SECTION_THREE_IMAGE})`,
        backgroundSize: "250%",
        backgroundPosition: "bottom right",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "0.5px white",
        paintOrder: "stroke fill",
        transform: "translateZ(0) rotate(-8deg)",
      }}
    >
      <a
        href="/drops/knux-necklace"
        onClick={(e) => { e.preventDefault(); window.location.href = "/drops/knux-necklace"; }}
        className="pointer-events-auto cursor-pointer flex items-end justify-end"
        aria-label="Shop Metal – view necklace, keychain and earrings"
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          backgroundImage: "inherit",
          backgroundSize: "inherit",
          backgroundPosition: "inherit",
          backgroundClip: "inherit",
          WebkitBackgroundClip: "inherit",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "inherit",
          paintOrder: "inherit",
          transform: "inherit",
        }}
      >
        <span className="flex items-center gap-[0.15em]">
          <span>metal</span>
          <span className="self-center" aria-hidden>&gt;</span>
        </span>
      </a>
    </div>
  );
}
