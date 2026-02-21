"use client";

import { useEffect, useRef } from "react";

export default function SectionThreeText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sectionThree = document.getElementById("section-three");
    const sectionFour = document.getElementById("section-four");
    if (!container || !sectionThree || !sectionFour) return;

    let rafId: number;

    function tick() {
      const vh = window.innerHeight;
      const s3Top = sectionThree!.getBoundingClientRect().top;
      const s4Top = sectionFour!.getBoundingClientRect().top;

      // Appear after squeegee is done (screen all black): when section 3 is in view
      const enterStart = vh * 0.85;
      const enterEnd = vh * 0.45;
      const enterProgress =
        s3Top >= enterStart ? 0 : s3Top <= enterEnd ? 1 : (enterStart - s3Top) / (enterStart - enterEnd);

      // Disappear as section 4 approaches (section 3 scrolls up)
      const exitStart = vh * 0.85;
      const exitEnd = vh * 0.45;
      const exitProgress =
        s4Top >= exitStart ? 0 : s4Top <= exitEnd ? 1 : (exitStart - s4Top) / (exitStart - exitEnd);

      const opacity = enterProgress * (1 - exitProgress);
      container!.style.opacity = String(opacity);
      container!.style.visibility = opacity > 0.01 ? "visible" : "hidden";

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center z-[3] pointer-events-none px-6"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div className="w-full max-w-2xl mx-auto text-center">
        <h2
          className="mb-6 md:mb-10"
          style={{
            fontFamily: "'Abject Failure', sans-serif",
            fontWeight: 600,
            color: "#ffffff",
            fontSize: "clamp(3rem, 12vw, 6.5rem)",
          }}
        >
          Local and Purpose-Driven
        </h2>
        <p
          className="max-w-2xl mx-auto"
          style={{
            fontFamily: '"pressio-stencil-cond", sans-serif',
            fontWeight: 700,
            color: "#ffffff",
            fontSize: "clamp(1.85rem, 6vw, 2.25rem)",
            lineHeight: 1.3,
          }}
        >
          Every order supports youth education and community programs in our studio.
        </p>
      </div>
    </div>
  );
}
