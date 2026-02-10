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
    const sectionFive = document.getElementById("section-five");
    if (!el || !sectionFour || !sectionFive) return;

    gsap.set(el, { opacity: 0 });

    // Section 4: drops text fades in as the hat is falling (starts when section 4 enters, after fog)
    const st4 = ScrollTrigger.create({
      id: "section-four-drops",
      trigger: sectionFour,
      start: "top 60%",
      end: "top -10%",
      scrub: 1,
      onUpdate: (self) => {
        const s5Rect = sectionFive.getBoundingClientRect();
        if (s5Rect.top < window.innerHeight) return; // section 5 in view — let section 5 trigger handle opacity
        el.style.opacity = String(self.progress);
      },
    });

    // Section 5: dissolve drops text sooner so it’s gone with the section 4 image
    return () => st4.kill();
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
      className="section-four-drops fixed inset-0 flex items-end justify-center pb-[12vh] xl:pb-[6vh] z-[30] pointer-events-none"
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
