"use client";

import { useEffect, useRef } from "react";

const SECTION_THREE_IMAGE =
  "/freepik__close-up-product-shot-of-this-necklace-swinging-ou__60531.png";

export default function SectionThreeFoggyCorner() {
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fog = fogRef.current;
    const sectionThree = document.getElementById("section-three");
    const sectionFour = document.getElementById("section-four");
    if (!fog || !sectionThree || !sectionFour) return;

    let rafId: number;
    let lastOpacity = 0;

    function tick() {
      const vh = window.innerHeight;
      const s3Top = sectionThree.getBoundingClientRect().top;
      const s4Top = sectionFour.getBoundingClientRect().top;

      // Fade in: section-three top from 12% → -15% of viewport (same feel as section 2 fog)
      const inStart = vh * 0.12;
      const inEnd = vh * -0.15;

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
        fog.style.opacity = String(opacity);
        lastOpacity = opacity;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={fogRef}
      className="fixed bottom-0 right-0 pointer-events-none"
      style={{
        width: "50vw",
        height: "45vh",
        zIndex: 2,
        opacity: 0,
      }}
    >
      {/* Blurred background layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${SECTION_THREE_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px)",
          WebkitFilter: "blur(50px)",
        }}
      />
      {/* Circular mask - fades smoothly from bottom-right corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "radial-gradient(ellipse 120% 140% at bottom right, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 120% 140% at bottom right, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.12)",
        }}
      />
      {/* Dark tint for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "radial-gradient(ellipse 120% 140% at bottom right, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 120% 140% at bottom right, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          background: "rgba(0,0,0,0.28)",
        }}
      />
    </div>
  );
}
