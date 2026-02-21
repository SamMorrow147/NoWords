"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 600;
const FINAL_OFFSET_LEFT = 10;
const FINAL_OFFSET_TOP = 0;

const GLOW_DESKTOP =
  "drop-shadow(0 0 6px rgba(65,105,225,0.95)) " +
  "drop-shadow(0 0 15px rgba(65,105,225,0.8)) " +
  "drop-shadow(0 0 35px rgba(65,105,225,0.6)) " +
  "drop-shadow(0 0 70px rgba(65,105,225,0.35)) " +
  "drop-shadow(0 0 120px rgba(65,105,225,0.2))";

const GLOW_MOBILE =
  "drop-shadow(0 0 4px rgba(65,105,225,0.95)) " +
  "drop-shadow(0 0 10px rgba(65,105,225,0.8)) " +
  "drop-shadow(0 0 20px rgba(65,105,225,0.6)) " +
  "drop-shadow(0 0 35px rgba(65,105,225,0.35))";

export default function LogoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [inSectionFour, setInSectionFour] = useState(false);
  const [inSectionFive, setInSectionFive] = useState(false);
  const [inLastSection, setInLastSection] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.25;
    const isMobile = window.innerWidth < 768;

    if (glowRef.current) {
      glowRef.current.style.filter = isMobile ? GLOW_MOBILE : GLOW_DESKTOP;
    }

    gsap.set(wrapper, {
      position: "fixed",
      top: 0,
      left: 0,
      width: isMobile ? "80vw" : "min(70vw, 20rem)",
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      scale: 0.08,
      zIndex: 30,
      transformOrigin: "center center",
      opacity: 1,
    });

    // On load: zoom from tiny to full size, then stop
    const zoomTl = gsap.timeline();
    zoomTl.to(wrapper, {
      scale: 1,
      duration: 0.55,
      ease: "power2.out",
      overwrite: true,
    });

    // Start scroll-driven timeline after zoom so it doesn't overwrite the zoom at load
    let tl: gsap.core.Timeline | undefined;
    const scrollTlId = window.setTimeout(() => {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper.parentElement ?? document.body,
          start: "top top",
          end: `+=${SCROLL_DURATION}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        wrapper,
        {
          x: centerX,
          y: centerY,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          transformOrigin: "center center",
        },
        {
          x: FINAL_OFFSET_LEFT,
          y: FINAL_OFFSET_TOP,
          xPercent: 0,
          yPercent: 0,
          scale: 0.38,
          transformOrigin: "0 0",
          ease: "none",
        }
      );
    }, 600);

    return () => {
      window.clearTimeout(scrollTlId);
      zoomTl.kill();
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  // In section four: switch to shimmer logo; reset when leaving forward OR back
  useEffect(() => {
    const sectionFour = document.getElementById("section-four");
    if (!sectionFour) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionFour,
      start: "top 30%",
      end: "top -10%",
      onEnter: () => setInSectionFour(true),
      onLeave: () => setInSectionFour(false),
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

  return (
    <div 
      ref={wrapperRef} 
      style={{ 
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0,
        overflow: "visible",
        willChange: "transform, opacity",
      }} 
      aria-hidden
    >
      <div
        ref={glowRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "visible",
          filter: GLOW_DESKTOP,
        }}
      >
        <img
          src="/logo_vectorized.svg"
          alt="No Words"
          className="block w-full h-auto"
          style={{
            opacity: (inLastSection || (inSectionFour && !inSectionFive)) ? 0 : 1,
            transition: "opacity 0.35s ease",
          }}
        />
        <div
          className="logo-shimmer block w-full min-h-[2rem]"
          style={{
            position: "absolute",
            inset: 0,
            opacity: (inLastSection || (inSectionFour && !inSectionFive)) ? 1 : 0,
            transition: "opacity 0.35s ease",
            aspectRatio: "968 / 1074",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
