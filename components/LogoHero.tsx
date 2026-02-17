"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedLogo from "./AnimatedLogo";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 600;
const FINAL_OFFSET = 24;

export default function LogoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inSectionFour, setInSectionFour] = useState(false);
  const [inSectionFive, setInSectionFive] = useState(false);
  const [inLastSection, setInLastSection] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    gsap.set(wrapper, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "min(90vw, 32rem)",
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      zIndex: 30,
      transformOrigin: "0 0",
      opacity: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper.parentElement ?? document.body,
        start: "top top",
        end: `+=${SCROLL_DURATION}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(wrapper, {
      x: FINAL_OFFSET,
      y: FINAL_OFFSET,
      xPercent: 0,
      yPercent: 0,
      scale: 0.5,
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // In section four (drops): switch to purple gradient shimmer logo
  useEffect(() => {
    const sectionFour = document.getElementById("section-four");
    if (!sectionFour) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionFour,
      start: "top 30%",
      end: "top -10%",
      onEnter: () => setInSectionFour(true),
      onLeaveBack: () => setInSectionFour(false),
    });

    return () => trigger.kill();
  }, []);

  // In section five: white logo
  useEffect(() => {
    const sectionFive = document.getElementById("section-five");
    if (!sectionFive) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionFive,
      start: "top 70%",
      end: "top -10%",
      onEnter: () => setInSectionFive(true),
      onLeaveBack: () => setInSectionFive(false),
    });

    return () => trigger.kill();
  }, []);

  // In last section (section six): purple logo
  useEffect(() => {
    const sectionSix = document.getElementById("section-six");
    if (!sectionSix) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionSix,
      start: "top 70%",
      end: "top -10%",
      onEnter: () => setInLastSection(true),
      onLeaveBack: () => setInLastSection(false),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div 
      ref={wrapperRef} 
      style={{ 
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0,
        willChange: "transform, opacity",
        WebkitBackfaceVisibility: "hidden",
        WebkitPerspective: 1000,
      }} 
      aria-hidden
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <span
          style={{
            display: "block",
            opacity: (inLastSection || (inSectionFour && !inSectionFive)) ? 0 : 1,
            transition: "opacity 0.35s ease",
          }}
        >
          <AnimatedLogo
            className="text-[#e8e6e3] block w-full"
            duration={1.1}
            delay={0.2}
            direction="left-to-right"
            strokeDuration={0.9}
            fillDuration={1}
          />
        </span>
        <div
          className="logo-shimmer block w-full min-h-[2rem]"
          style={{
            position: "absolute",
            inset: 0,
            opacity: (inLastSection || (inSectionFour && !inSectionFive)) ? 1 : 0,
            transition: "opacity 0.35s ease",
            aspectRatio: "4668 / 1022",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
