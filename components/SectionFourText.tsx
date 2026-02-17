"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const SECTION_FOUR_IMAGE = "/freepik__an-image-outside-in-a-blizzard-at-a-big-box-of-the__64105.png";

export default function SectionFourText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const sectionFour = document.getElementById("section-four");
    const sectionFive = document.getElementById("section-five");
    if (!el || !sectionFour || !sectionFive) return;

    let rafId: number;
    let lastOp = -1;

    const _el = el;
    const _s4 = sectionFour;
    const _s5 = sectionFive;

    function tick() {
      const vh = window.innerHeight;
      const s4Top = _s4.getBoundingClientRect().top;
      const s5Top = _s5.getBoundingClientRect().top;

      // Don't show once section 5 is in view
      if (s5Top < vh) {
        if (lastOp !== 0) {
          _el.style.opacity = "0";
          lastOp = 0;
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Fade in: section-four top goes from 60% → -10% of vh
      const inStart = vh * 0.6;
      const inEnd = vh * -0.1;
      const progress = Math.max(
        0,
        Math.min(1, (inStart - s4Top) / (inStart - inEnd))
      );

      if (Math.abs(progress - lastOp) > 0.003) {
        _el.style.opacity = String(progress);
        lastOp = progress;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const textStyle = {
    fontFamily: "'Abject Failure', sans-serif",
    fontSize: "clamp(4rem, 15vw, 12rem)",
    fontWeight: 600,
    transform: "rotate(-4deg)",
    backgroundImage: `url(${SECTION_FOUR_IMAGE})`,
    backgroundSize: "280%",
    backgroundPosition: "center 82%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.5px white",
    paintOrder: "stroke fill",
  };

  return (
    <div
      ref={textRef}
      className="section-four-drops fixed inset-0 flex items-end justify-center pb-[12vh] xl:pb-[6vh] z-[30] pointer-events-none"
      style={{ opacity: 0, ...textStyle }}
    >
      <Link
        href="/drops"
        className="pointer-events-auto cursor-pointer flex items-end gap-[0.12em]"
        aria-label="View drops"
        style={textStyle}
      >
        <span>drops</span>
        <span>&gt;</span>
      </Link>
    </div>
  );
}
