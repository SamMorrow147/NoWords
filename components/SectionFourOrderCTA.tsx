"use client";

import { useEffect, useRef } from "react";
import MaskButton from "./MaskButton";

const setClip = (el: HTMLElement, value: string) => {
  el.style.setProperty("clip-path", value);
  el.style.setProperty("-webkit-clip-path", value);
};

export default function SectionFourOrderCTA() {
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const lineEl = lineRef.current;
    const btnEl = btnRef.current;
    const sectionFour = document.getElementById("section-four");
    const sectionFive = document.getElementById("section-five");
    if (!textEl || !btnEl || !sectionFour || !sectionFive) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile && lineEl) setClip(lineEl, "inset(0 100% 0 0)");

    let rafId: number;
    let lastTextOp = -1;
    let lastBtnOp = -1;
    let lastClipVal = -1;

    function tick() {
      const vh = window.innerHeight;
      const s4Top = sectionFour!.getBoundingClientRect().top;
      const s5Top = sectionFive!.getBoundingClientRect().top;

      let textProgress = 0;
      let btnProgress = 0;

      if (s5Top >= vh) {
        const inStart = vh * 0.6;
        const inEnd = vh * -0.1;
        textProgress = Math.max(0, Math.min(1, (inStart - s4Top) / (inStart - inEnd)));

        // Shirt (beanie) animation ends when section-four top hits -50% viewport; delay button until after that
        const shirtLanded = vh * -0.5;
        const btnFadeEnd = vh * -0.15;
        if (s4Top <= shirtLanded) {
          btnProgress = s4Top <= btnFadeEnd ? 1 : (shirtLanded - s4Top) / (shirtLanded - btnFadeEnd);
        }
      }

      if (Math.abs(textProgress - lastTextOp) > 0.003) {
        textEl!.style.opacity = String(textProgress);
        lastTextOp = textProgress;
      }

      // On mobile: reveal text with scroll via clip-path (first 28% of scroll = full reveal). Extend bottom inset so white glow isn't cropped.
      if (isMobile && lineEl) {
        const clipProgress = Math.max(0, Math.min(1, textProgress / 0.28));
        const clipVal = 100 - clipProgress * 100;
        if (Math.abs(clipVal - lastClipVal) > 0.5) {
          const clipPath = clipVal <= 0 ? "inset(0 0 -60px 0)" : `inset(0 ${clipVal}% 0 0)`;
          setClip(lineEl, clipPath);
          lastClipVal = clipVal;
        }
      }

      if (Math.abs(btnProgress - lastBtnOp) > 0.003) {
        btnEl!.style.opacity = String(btnProgress);
        btnEl!.style.pointerEvents = btnProgress > 0.1 ? "auto" : "none";
        lastBtnOp = btnProgress;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Text — on mobile: top area + scroll reveal; on desktop: bottom, opacity only */}
      <div
        ref={textRef}
        className="fixed inset-0 flex flex-col items-center justify-start pt-[18vh] md:justify-end md:pt-0 md:pb-[22vh] xl:pb-[18vh] z-[30] pointer-events-none overflow-visible"
        style={{ opacity: 0, willChange: "opacity" }}
      >
        <p
          ref={lineRef}
          className="text-black text-center px-4 pb-6 text-[clamp(3.75rem,14vw,5.5rem)] md:text-[clamp(3.25rem,13vw,7rem)]"
          style={{
            fontFamily: "'Abject Failure', sans-serif",
            fontWeight: 600,
            lineHeight: 1.2,
            textShadow:
              "2px 2px 0 rgba(255,255,255,0.95), " +
              "4px 4px 0 rgba(255,255,255,0.8), " +
              "0 0 20px rgba(255,255,255,0.9), " +
              "0 0 40px rgba(255,255,255,0.6)",
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
