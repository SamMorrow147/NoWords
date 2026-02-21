"use client";

import { useEffect, useRef } from "react";
import MaskButton from "./MaskButton";

export default function SectionFourOrderCTA() {
  const textRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const btnEl = btnRef.current;
    const sectionFour = document.getElementById("section-four");
    const sectionFive = document.getElementById("section-five");
    if (!textEl || !btnEl || !sectionFour || !sectionFive) return;

    let rafId: number;
    let lastOp = -1;

    function tick() {
      const vh = window.innerHeight;
      const s4Top = sectionFour!.getBoundingClientRect().top;
      const s5Top = sectionFive!.getBoundingClientRect().top;

      let progress = 0;
      if (s5Top >= vh) {
        const inStart = vh * 0.6;
        const inEnd = vh * -0.1;
        progress = Math.max(0, Math.min(1, (inStart - s4Top) / (inStart - inEnd)));
      }

      if (Math.abs(progress - lastOp) > 0.003) {
        textEl!.style.opacity = String(progress);
        btnEl!.style.opacity = String(progress);
        btnEl!.style.pointerEvents = progress > 0.1 ? "auto" : "none";
        lastOp = progress;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Text — opacity animated via JS */}
      <div
        ref={textRef}
        className="fixed inset-0 flex flex-col items-center justify-end pb-[22vh] xl:pb-[18vh] z-[30] pointer-events-none"
        style={{ opacity: 0, willChange: "opacity" }}
      >
        <p
          className="text-white text-center px-4"
          style={{
            fontFamily: "'Abject Failure', sans-serif",
            fontSize: "clamp(3.25rem, 13vw, 7rem)",
            fontWeight: 600,
            lineHeight: 1.2,
            textShadow:
              "2px 2px 0px rgba(0,0,0,0.9), " +
              "4px 4px 0px rgba(0,0,0,0.7), " +
              "0 0 20px rgba(0,0,0,0.9), " +
              "0 0 40px rgba(0,0,0,0.7)",
          }}
        >
          Put an order in today
        </p>
      </div>

      {/* Button — separate element, opacity animated independently so JS never touches its children */}
      <div
        ref={btnRef}
        className="fixed bottom-0 left-0 right-0 flex justify-center pb-[10vh] xl:pb-[8vh] z-[30]"
        style={{ opacity: 0, pointerEvents: "none", willChange: "opacity" }}
      >
        <MaskButton href="/contact" label="Contact" />
      </div>
    </>
  );
}
