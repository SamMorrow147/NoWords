"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WIPE_SOFTNESS = 30;

export default function AnimatedLogoImage({
  src,
  alt,
  className = "",
  strokeDuration = 1.2,
  fillDuration = 1.6,
  delay = 0.3,
  aspectRatio = "968 / 1074",
}: {
  src: string;
  alt: string;
  className?: string;
  strokeDuration?: number;
  fillDuration?: number;
  delay?: number;
  aspectRatio?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ v: -WIPE_SOFTNESS });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const proxy = progressRef.current;
    proxy.v = -WIPE_SOFTNESS;
    applyMask(el, proxy.v);

    const tl = gsap.timeline({ delay });

    tl.to(proxy, {
      v: 100 + WIPE_SOFTNESS,
      duration: fillDuration,
      ease: "power2.inOut",
      onUpdate: () => applyMask(el, proxy.v),
    });

    return () => {
      tl.kill();
    };
  }, [delay, strokeDuration, fillDuration]);

  return (
    <div
      ref={containerRef}
      className={`relative block w-full ${className}`}
      style={{ aspectRatio }}
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className="block w-full h-full object-contain"
      />
    </div>
  );
}

function applyMask(el: HTMLElement, progress: number) {
  const leading = progress;
  const trailing = progress - WIPE_SOFTNESS;

  el.style.maskImage = `linear-gradient(to right,
    transparent ${trailing}%,
    black ${leading}%,
    transparent ${leading + 0.5}%)`;
  el.style.webkitMaskImage = el.style.maskImage;
}
