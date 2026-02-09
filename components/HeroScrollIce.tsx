"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import IceThawCanvas, { type IceThawCanvasHandle } from "./IceThawCanvas";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_START = "top top-=400";
const SCROLL_END = "top top-=900";

export default function HeroScrollIce() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<IceThawCanvasHandle>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const handleReady = useCallback(() => setCanvasReady(true), []);

  useEffect(() => {
    const section = containerRef.current?.parentElement ?? document.body;
    const handle = canvasRef.current;
    if (!handle || !canvasReady) return;

    handle.setReveal(0);

    const st = ScrollTrigger.create({
      trigger: section,
      start: SCROLL_START,
      end: SCROLL_END,
      scrub: 0.5,
      onUpdate: (self) => {
        handle.setReveal(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [canvasReady]);

  return (
    <div ref={containerRef} className="hero-scroll-ice" aria-hidden>
      <IceThawCanvas ref={canvasRef} maxOpacity={0.12} onReady={handleReady} />
    </div>
  );
}
