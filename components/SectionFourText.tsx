"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_FOUR_IMAGE = "/freepik__an-image-outside-in-a-blizzard-at-a-big-box-of-the__64105.png";

export default function SectionFourText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const sectionFour = document.getElementById("section-four");
    if (!el || !sectionFour) return;

    gsap.set(el, { opacity: 0 });

    // Fade in after the fog (same pattern as section 2)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFour,
        start: "top -5%",
        end: "top -25%",
        scrub: 1,
      },
    });

    tl.to(el, { opacity: 1, ease: "power1.inOut" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const textStyle = {
    fontFamily: "'Abject Failure', sans-serif",
    fontSize: "clamp(4rem, 15vw, 12rem)",
    fontWeight: 600,
    transform: "translateZ(0) rotate(-4deg)",
  };

  return (
    <div
      ref={textRef}
      className="fixed inset-0 flex items-end justify-center pb-[12vh] xl:pb-[6vh] z-[3] pointer-events-none"
      style={{
        opacity: 0,
        ...textStyle,
        backgroundImage: `url(${SECTION_FOUR_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      <Link
        href="/drops"
        className="pointer-events-auto cursor-pointer flex items-end gap-[0.12em]"
        aria-label="View latest drops"
      >
        <span className="relative inline-block" style={textStyle}>
          latest drops
          {/* Darken the image inside the text */}
          <span
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              ...textStyle,
              background: "rgba(0, 0, 0, 0.3)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
            aria-hidden
          >
            latest drops
          </span>
        </span>
        <span className="relative inline-block" style={textStyle}>
          &gt;
          <span
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              ...textStyle,
              background: "rgba(0, 0, 0, 0.3)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
            aria-hidden
          >
            &gt;
          </span>
        </span>
      </Link>
    </div>
  );
}
