"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HandwrittenText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!container || !line1 || !line2) return;

    const setClip = (el: HTMLElement, value: string) => {
      el.style.setProperty("clip-path", value);
      el.style.setProperty("-webkit-clip-path", value);
    };

    // Lines start fully clipped; type out on load
    setClip(line1, "inset(0 100% 0 0)");
    setClip(line2, "inset(0 100% 0 0)");
    gsap.set(container, { y: 0 });

    const progress = { line1: 0, line2: 0 };
    const typeTl = gsap.timeline({ delay: 0.4 });
    typeTl.to(progress, {
      line1: 1,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setClip(line1, `inset(0 ${(1 - progress.line1) * 100}% 0 0)`),
    });
    typeTl.to(progress, {
      line2: 1,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setClip(line2, `inset(0 ${(1 - progress.line2) * 100}% 0 0)`),
    }, "-=0.15");

    // Slide up off screen as you scroll — scrubbed so it moves with your scroll
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=300",
        scrub: true,
      },
    });
    exitTl.to(container, {
      y: () => -window.innerHeight * 1.1,
      ease: "none",
    });

    return () => {
      typeTl.kill();
      exitTl.scrollTrigger?.kill();
      exitTl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col z-[45] pointer-events-none"
    >
      <div className="flex-[1.05] md:flex-1" aria-hidden />
      <div className="flex-[0.95] md:flex-1 flex items-center justify-center">
        <div
          className="flex flex-col items-center text-center"
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
            className="block whitespace-nowrap"
            style={{ fontSize: "clamp(4rem, 16vw, 6.5rem)" }}
          >
            No Words
          </span>
          <span
            ref={line2Ref}
            className="block mt-1 whitespace-nowrap"
            style={{ fontSize: "clamp(2.5rem, 10vw, 4rem)" }}
          >
            printing studio
          </span>
        </div>
      </div>
    </div>
  );
}
