"use client";

import { useEffect, useRef } from "react";
import { flickerState } from "./flickerState";
import GraffitiDrips from "./GraffitiDrips";

export default function SectionFiveMadeByHand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const shadow = shadowRef.current;
    const sectionFive = document.getElementById("section-five");
    const sectionSix = document.getElementById("section-six");
    if (!container || !line1 || !line2 || !shadow || !sectionFive) return;

    // Safari-safe clip-path setter
    const setClip = (el: HTMLElement, value: string) => {
      el.style.setProperty("clip-path", value);
      el.style.setProperty("-webkit-clip-path", value);
    };

    // Initialize hidden
    container.style.opacity = "0";
    setClip(line1, "inset(0 100% 0 0)");
    setClip(line2, "inset(0 100% 0 0)");

    let rafId: number;
    let lastContainerOp = -1;
    let lastL1val = -1;
    let lastL2val = -1;
    let lastShadowOp = -1;

    function tick() {
      const vh = window.innerHeight;
      const s5Top = sectionFive!.getBoundingClientRect().top;
      const s6Top = sectionSix
        ? sectionSix.getBoundingClientRect().top
        : Infinity;

      // --- Reveal progress: section-five top goes from 60% → 10% of vh ---
      const revealStart = vh * 0.6;
      const revealEnd = vh * 0.1;
      const revealProgress = Math.max(
        0,
        Math.min(1, (revealStart - s5Top) / (revealStart - revealEnd))
      );

      // --- Exit progress: section-six top goes from 140% → 60% of vh ---
      const exitStart = vh * 1.4;
      const exitEnd = vh * 0.6;
      const exitProgress =
        s6Top >= exitStart
          ? 0
          : s6Top <= exitEnd
            ? 1
            : (exitStart - s6Top) / (exitStart - exitEnd);

      // Container opacity: fade in with reveal, fade out with exit
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

      // Only update DOM when values actually change
      if (Math.abs(containerOp - lastContainerOp) > 0.003) {
        container.style.opacity = String(containerOp);
        if (containerOp <= 0.003) {
          container.style.visibility = "hidden";
        } else {
          container.style.visibility = "visible";
        }
        lastContainerOp = containerOp;
      }

      if (Math.abs(l1val - lastL1val) > 0.1) {
        setClip(line1, `inset(0 ${l1val}% 0 0)`);
        lastL1val = l1val;
      }

      if (Math.abs(l2val - lastL2val) > 0.1) {
        setClip(line2, `inset(0 ${l2val}% 0 0)`);
        lastL2val = l2val;
      }

      // Flicker shadow (only when visible)
      if (containerOp > 0.01) {
        const visible = s5Top < vh * 0.4;
        if (visible) {
          const flicker = flickerState.value;
          if (Math.abs(flicker - lastShadowOp) > 0.005) {
            shadow.style.opacity = String(flicker);
            lastShadowOp = flicker;
          }
        } else if (lastShadowOp !== 0) {
          shadow.style.opacity = "0";
          lastShadowOp = 0;
        }
      } else if (lastShadowOp !== 0) {
        shadow.style.opacity = "0";
        lastShadowOp = 0;
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
      className="fixed inset-0 flex items-center justify-center z-[45] pointer-events-none"
      style={{
        opacity: 0,
        visibility: "hidden",
      }}
    >
      <div
        className="graffiti-drip-anchor flex flex-col items-center text-center relative"
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
          className="drip-line block"
          style={{ fontSize: "clamp(3rem, 12vw, 6.5rem)" }}
        >
          <span className="drip-letter-first">M</span>ade by Hand I<span className="drip-letter-last">n</span>
        </span>
        <span
          ref={line2Ref}
          className="drip-line block"
          style={{ fontSize: "clamp(3rem, 12vw, 6.5rem)" }}
        >
          <span className="drip-letter-first">M</span>inneapoli<span className="drip-letter-last">s</span>
        </span>
        <GraffitiDrips />
        {/* Flickering shadow underneath the text */}
        <div
          ref={shadowRef}
          style={{
            position: "absolute",
            bottom: "-4rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "110%",
            height: "3.5rem",
            opacity: 0,
            background: "radial-gradient(ellipse 100% 100% at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, transparent 75%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
