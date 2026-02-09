"use client";

import { useEffect, useRef } from "react";

export default function SectionTwoText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const sectionTwo = document.getElementById("section-two");
    const sectionThree = document.getElementById("section-three");
    if (!el || !sectionTwo || !sectionThree) return;

    let rafId: number;
    let lastOpacity = 0;

    function tick() {
      const vh = window.innerHeight;
      const s2Top = sectionTwo!.getBoundingClientRect().top;
      const s3Top = sectionThree!.getBoundingClientRect().top;

      // Fade in: section-two top from -5% → -25% of viewport
      const inStart = vh * -0.05;
      const inEnd = vh * -0.25;

      // Fade out: section-three top from 100% → 85% of viewport
      const outStart = vh;
      const outEnd = vh * 0.85;

      let opacity = 0;

      if (s3Top <= outEnd) {
        opacity = 0;
      } else if (s3Top < outStart) {
        opacity = (s3Top - outEnd) / (outStart - outEnd);
      } else if (s2Top <= inEnd) {
        opacity = 1;
      } else if (s2Top < inStart) {
        opacity = 1 - (s2Top - inEnd) / (inStart - inEnd);
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

  const sharedFont = {
    fontFamily: "'Abject Failure', sans-serif",
    fontSize: "clamp(4rem, 15vw, 12rem)",
    fontWeight: 600,
  } as const;

  return (
    <div
      ref={textRef}
      className="fixed inset-0 z-[40] pointer-events-none"
      style={{ opacity: 0, transform: "translateZ(0)" }}
    >
      {/* Gradient stroke layer (behind) — white top → purple bottom on "you " and "cha!" only */}
      <div
        className="absolute inset-0 flex items-end justify-center pb-[8vh] xl:pb-[3vh]"
        aria-hidden
        style={sharedFont}
      >
        <span
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(128,0,128,0.85))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            WebkitTextStroke: "3px transparent",
          }}
        >
          you{" "}
        </span>
        <span style={{ color: "transparent", WebkitTextStroke: "transparent" }}>BET</span>
        <span
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(128,0,128,0.85))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            WebkitTextStroke: "3px transparent",
          }}
        >
          cha!
        </span>
      </div>
      {/* Image fill layer (front) — "BET" has white stroke; mobile: thinner stroke, more zoom */}
      <div
        className="section-two-image-fill absolute inset-0 flex items-end justify-center pb-[8vh] xl:pb-[3vh]"
        style={{
          ...sharedFont,
          backgroundImage:
            "url('/freepik__a-young-ethnic-woman-in-a-purple-shirt-and-winter-__60532.png')",
          backgroundSize: "118%",
          backgroundPosition: "center",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      >
        you{" "}
        <span className="section-two-bet-stroke" style={{ paintOrder: "stroke fill" }}>
          BET
        </span>
        cha!
      </div>
    </div>
  );
}
