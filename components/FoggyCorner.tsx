"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FoggyCorner({
  imagePath = "/Heroimage.png",
}: {
  imagePath?: string;
}) {
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fog = fogRef.current;
    if (!fog) return;

    gsap.set(fog, { opacity: 0 });

    const section = fog.parentElement;

    // Fade in after the figure settles, finish before text at 20%
    // Fog fully in by ~700px; text triggers at 20% (~720px) so fog is in place first
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section ?? document.body,
        start: "top top-=500",
        end: "top top-=700",
        scrub: 1,
      },
    });

    tl.to(fog, {
      opacity: 1,
      ease: "power1.inOut",
    });

    // Fade out later — after fog has had time to be visible
    const sectionTwo = document.getElementById("section-two");
    let exitTl: gsap.core.Timeline | undefined;
    if (sectionTwo) {
      exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionTwo,
          start: "top 40%",
          end: "top 15%",
          scrub: true,
        },
      });

      exitTl.to(fog, { opacity: 0, ease: "none" });
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      exitTl?.scrollTrigger?.kill();
      exitTl?.kill();
    };
  }, []);

  return (
    <div
      ref={fogRef}
      className="fixed bottom-0 left-0 pointer-events-none"
      style={{
        width: "50vw",
        height: "45vh",
        zIndex: 35,
        opacity: 0,
      }}
    >
      {/* Blurred background layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imagePath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px)",
          WebkitFilter: "blur(50px)",
        }}
      />
      {/* Circular mask - fades smoothly from corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage: "radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.15)",
        }}
      />
    </div>
  );
}
