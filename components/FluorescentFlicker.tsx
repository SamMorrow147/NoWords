"use client";

import { useEffect, useRef } from "react";
import { flickerState } from "./flickerState";

// Fluorescent flicker pattern - irregular with occasional dips and buzzes
function getFlicker(t: number): number {
  let brightness = 0.7;
  brightness += Math.sin(t * 120) * 0.03;
  brightness += (Math.random() - 0.5) * 0.06;
  const cycle = t % 4;
  if (cycle > 3.2 && cycle < 3.35) brightness *= 0.3;
  if (cycle > 3.38 && cycle < 3.42) brightness *= 0.5;
  if (cycle > 1.6 && cycle < 1.63) brightness *= 0.4;
  const longCycle = t % 11;
  if (longCycle > 10.0 && longCycle < 10.15) brightness *= 0.1;
  if (longCycle > 10.2 && longCycle < 10.28) brightness *= 0.6;
  return Math.max(0.05, Math.min(1, brightness));
}

export default function FluorescentFlicker() {
  const lightRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const shadow = shadowRef.current;
    const darken = darkenRef.current;
    const sectionFive = document.getElementById("section-five");
    const sectionSix = document.getElementById("section-six");
    if (!light || !shadow || !darken || !sectionFive) return;

    let rafId: number;
    let lastLightOp = 0;
    let lastShadowOp = 0;
    let lastDarkenOp = 0;
    let flickerTime = 0;
    let lastFrame = performance.now();

    function tick() {
      const now = performance.now();
      const dt = (now - lastFrame) / 1000;
      lastFrame = now;

      const vh = window.innerHeight;
      const s5Top = sectionFive!.getBoundingClientRect().top;
      const s6Top = sectionSix ? sectionSix.getBoundingClientRect().top : Infinity;

      const inStart = vh * 0.75;
      const inEnd = vh * 0.4;
      const outStart = vh * 1.4;
      const outEnd = vh * 0.6;

      let sectionOpacity = 0;
      if (s6Top <= outEnd) {
        sectionOpacity = 0;
      } else if (s6Top < outStart) {
        sectionOpacity = (s6Top - outEnd) / (outStart - outEnd);
      } else if (s5Top <= inEnd) {
        sectionOpacity = 1;
      } else if (s5Top < inStart) {
        sectionOpacity = 1 - (s5Top - inEnd) / (inStart - inEnd);
      }

      sectionOpacity = Math.max(0, Math.min(1, sectionOpacity));

      if (sectionOpacity > 0) {
        flickerTime += dt;
        const flicker = getFlicker(flickerTime);
        flickerState.value = flicker;
        const lightOp = sectionOpacity * flicker;
        const shadowOp = sectionOpacity * flicker;

        if (Math.abs(lightOp - lastLightOp) > 0.005) {
          light!.style.opacity = String(lightOp);
          lastLightOp = lightOp;
        }
        if (Math.abs(shadowOp - lastShadowOp) > 0.005) {
          shadow!.style.opacity = String(shadowOp);
          lastShadowOp = shadowOp;
        }

        // Darken the background when the light dips
        const darkenOp = sectionOpacity * (1 - flicker) * 0.25;
        if (Math.abs(darkenOp - lastDarkenOp) > 0.005) {
          darken!.style.opacity = String(darkenOp);
          lastDarkenOp = darkenOp;
        }
      } else {
        if (lastLightOp !== 0) {
          light!.style.opacity = "0";
          lastLightOp = 0;
        }
        if (lastShadowOp !== 0) {
          shadow!.style.opacity = "0";
          lastShadowOp = 0;
        }
        if (lastDarkenOp !== 0) {
          darken!.style.opacity = "0";
          lastDarkenOp = 0;
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Top: white fluorescent light from ceiling */}
      <div
        ref={lightRef}
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          opacity: 0,
          zIndex: 6,
          height: "70vh",
          background: "linear-gradient(to bottom, rgba(220, 230, 255, 0.35) 0%, rgba(220, 230, 255, 0.12) 25%, rgba(200, 215, 255, 0.04) 50%, transparent 100%)",
          mixBlendMode: "screen",
        }}
        aria-hidden
      />
      {/* Full-screen darken layer — synced to flicker dips */}
      <div
        ref={darkenRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0,
          zIndex: 5,
          background: "rgba(0, 0, 0, 1)",
        }}
        aria-hidden
      />
      {/* Bottom: dark shadow from floor */}
      <div
        ref={shadowRef}
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          opacity: 0,
          zIndex: 6,
          height: "70vh",
          background: "linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.18) 25%, rgba(0, 0, 0, 0.05) 50%, transparent 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden
      />
    </>
  );
}
