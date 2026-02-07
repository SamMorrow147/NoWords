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

  return (
    <div
      ref={textRef}
      className="fixed inset-0 flex items-end justify-center pb-[8vh] xl:pb-[3vh] z-[3] pointer-events-none"
      style={{
        opacity: 0,
        fontFamily: "'Abject Failure', sans-serif",
        fontSize: "clamp(4rem, 15vw, 12rem)",
        fontWeight: 600,
        backgroundImage:
          "url('/freepik__a-young-ethnic-woman-in-a-purple-shirt-and-winter-__60532.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        transform: "translateZ(0)",
      }}
    >
      you BETcha!
    </div>
  );
}
