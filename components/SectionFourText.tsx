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
    backgroundImage: `url(${SECTION_FOUR_IMAGE})`,
    backgroundSize: "280%",
    backgroundPosition: "center 82%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.5px white",
    paintOrder: "stroke fill",
  };

  return (
    <div
      ref={textRef}
      className="fixed inset-0 flex items-end justify-center pb-[12vh] xl:pb-[6vh] z-[40] pointer-events-none"
      style={{ opacity: 0, ...textStyle }}
    >
      <Link
        href="/drops"
        className="pointer-events-auto cursor-pointer flex items-end gap-[0.12em]"
        aria-label="View drops"
        style={textStyle}
      >
        <span>drops</span>
        <span>&gt;</span>
      </Link>
    </div>
  );
}
