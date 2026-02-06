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

    // Fade in when scrolling near bottom - slow and gradual
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "40% bottom",
        end: "95% bottom",
        scrub: 3,
        toggleActions: "play none none reverse",
      },
    });

    tl.to(fog, {
      opacity: 1,
      duration: 1,
      ease: "power1.inOut",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={fogRef}
      className="fixed bottom-0 left-0 pointer-events-none"
      style={{
        width: "50vw",
        height: "35vh",
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
          maskImage: "radial-gradient(circle at bottom left, black 0%, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle at bottom left, black 0%, black 20%, transparent 60%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.15)",
        }}
      />
    </div>
  );
}
