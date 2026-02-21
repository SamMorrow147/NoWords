"use client";

import { useEffect, useRef } from "react";
import GraffitiDrips from "./GraffitiDrips";

export default function SectionSixFollowSeasons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const sectionSix = document.getElementById("section-six");
    if (!container || !line1 || !line2 || !sectionSix) return;

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

    const _container = container;
    const _line1 = line1;
    const _line2 = line2;
    const _sectionSix = sectionSix;

    function tick() {
      const vh = window.innerHeight;
      const s6Top = _sectionSix.getBoundingClientRect().top;

      // Reveal: section-six top goes from 60% → 10% of vh
      const revealStart = vh * 0.6;
      const revealEnd = vh * 0.1;
      const revealProgress = Math.max(
        0,
        Math.min(1, (revealStart - s6Top) / (revealStart - revealEnd))
      );

      // Container fade-in over first 15% of reveal
      const containerOp = Math.min(1, revealProgress / 0.15);

      // Clip-path reveal for line 1 (5% → 55%)
      const l1p = Math.max(0, Math.min(1, (revealProgress - 0.05) / 0.5));
      const l1val = 100 - l1p * 100;

      // Clip-path reveal for line 2 (35% → 85%)
      const l2p = Math.max(0, Math.min(1, (revealProgress - 0.35) / 0.5));
      const l2val = 100 - l2p * 100;

      if (Math.abs(containerOp - lastContainerOp) > 0.003) {
        _container.style.opacity = String(containerOp);
        if (containerOp <= 0.003) {
          _container.style.visibility = "hidden";
        } else {
          _container.style.visibility = "visible";
        }
        lastContainerOp = containerOp;
      }

      if (Math.abs(l1val - lastL1val) > 0.1) {
        setClip(_line1, `inset(0 ${l1val}% 0 0)`);
        lastL1val = l1val;
      }

      if (Math.abs(l2val - lastL2val) > 0.1) {
        setClip(_line2, `inset(0 ${l2val}% 0 0)`);
        lastL2val = l2val;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-start justify-center pt-[15vh] z-[45] pointer-events-none"
      style={{
        opacity: 0,
        visibility: "hidden",
      }}
    >
      <div
        className="graffiti-drip-anchor-s6 flex flex-col items-center text-center relative"
        style={{
          fontFamily: "'Abject Failure', sans-serif",
          fontWeight: 600,
          color: "white",
          filter: "drop-shadow(2px 3px 6px rgba(0,0,0,0.7))",
          transform: "rotate(-3deg)",
        }}
      >
        <span
          ref={line1Ref}
          className="block"
          style={{ fontSize: "clamp(3rem, 12vw, 6.5rem)" }}
        >
          Follow with
        </span>
        <span
          ref={line2Ref}
          className="drip-line block"
          style={{ fontSize: "clamp(3rem, 12vw, 6.5rem)" }}
        >
          the <span className="drip-letter-first">S</span>easo<span className="drip-letter-last">n</span>s
        </span>
        <GraffitiDrips
          anchorClass="graffiti-drip-anchor-s6"
          triggerSectionId="section-six"
          triggerStart="top 80%"
          triggerEnd="top 15%"
          groupOffsets={[0.82, 0.92, 0.82, 0.92]}
          yOffset={12}
          firstXNudge={12}
          firstYNudge={10}
        />
      </div>
    </div>
  );
}
