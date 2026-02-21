"use client";

import { useEffect, useRef } from "react";

export default function HeroTagline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const sectionTwo = document.getElementById("section-two");
    if (!container || !line1 || !line2) return;

    const setClip = (el: HTMLElement, value: string) => {
      el.style.setProperty("clip-path", value);
      el.style.setProperty("-webkit-clip-path", value);
    };

    container.style.opacity = "0";
    setClip(line1, "inset(0 100% 0 0)");
    setClip(line2, "inset(0 100% 0 0)");

    let rafId: number;
    let lastContainerOp = -1;
    let lastL1val = -1;
    let lastL2val = -1;

    function tick() {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Reveal: starts very early, as soon as you begin scrolling
      const revealStart = 80;
      const revealEnd = 400;
      const revealProgress = Math.max(
        0,
        Math.min(1, (scrollY - revealStart) / (revealEnd - revealStart))
      );

      // Exit: fade out as section 2 approaches
      let exitProgress = 0;
      if (sectionTwo) {
        const s2Top = sectionTwo.getBoundingClientRect().top;
        const exitStart = vh * 1.2;
        const exitEnd = vh * 0.5;
        exitProgress =
          s2Top >= exitStart ? 0
            : s2Top <= exitEnd ? 1
            : (exitStart - s2Top) / (exitStart - exitEnd);
      }

      // Container opacity
      let containerOp = 0;
      if (exitProgress >= 1) {
        containerOp = 0;
      } else {
        const fadeIn = Math.min(1, revealProgress / 0.15);
        containerOp = fadeIn * (1 - exitProgress);
      }

      // Clip-path reveal for line 1 (5% → 55% of reveal)
      const l1p = Math.max(0, Math.min(1, (revealProgress - 0.05) / 0.5));
      const l1val = 100 - l1p * 100;

      // Clip-path reveal for line 2 (35% → 85% of reveal)
      const l2p = Math.max(0, Math.min(1, (revealProgress - 0.35) / 0.5));
      const l2val = 100 - l2p * 100;

      if (Math.abs(containerOp - lastContainerOp) > 0.003) {
        container!.style.opacity = String(containerOp);
        container!.style.visibility = containerOp <= 0.003 ? "hidden" : "visible";
        lastContainerOp = containerOp;
      }

      if (Math.abs(l1val - lastL1val) > 0.1) {
        setClip(line1!, `inset(0 ${l1val}% 0 0)`);
        lastL1val = l1val;
      }

      if (Math.abs(l2val - lastL2val) > 0.1) {
        setClip(line2!, `inset(0 ${l2val}% 0 0)`);
        lastL2val = l2val;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-end justify-center pb-12 z-[45] pointer-events-none"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {/* Dark gradient scrim: transparent at top, dark at bottom for text legibility */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "45%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
        aria-hidden
      />
      <div
        className="flex flex-col items-center text-center relative px-4 max-w-[90vw]"
        style={{
          fontFamily: '"pressio-stencil-cond", sans-serif',
          fontWeight: 500,
          color: "white",
          filter: "drop-shadow(1px 1px 3px rgba(0,0,0,0.6))",
        }}
      >
        <span
          ref={line1Ref}
          className="block"
          style={{ fontSize: "clamp(2rem, 7vw, 3.25rem)" }}
        >
          Custom Apparel Production
        </span>
        <span
          ref={line2Ref}
          className="block"
          style={{
            fontSize: "clamp(2.75rem, 9vw, 4.25rem)",
            fontFamily: "'Abject Failure', sans-serif",
          }}
        >
          in Minneapolis
        </span>
      </div>
    </div>
  );
}
