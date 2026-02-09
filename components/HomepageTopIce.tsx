"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import IceThawCanvas, { type IceThawCanvasHandle } from "./IceThawCanvas";

const SCROLL_TOP_THRESHOLD = 12;

export default function HomepageTopIce() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<IceThawCanvasHandle>(null);

  const handleReady = useCallback(() => setCanvasReady(true), []);

  // Track scroll
  useEffect(() => {
    function checkScroll() {
      setIsAtTop(window.scrollY <= SCROLL_TOP_THRESHOLD);
    }
    const id = requestAnimationFrame(checkScroll);
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  // Drive the canvas reveal — only after the canvas image is loaded
  useEffect(() => {
    const handle = canvasRef.current;
    if (!handle || !canvasReady) return;

    let animId: number | null = null;

    if (isAtTop) {
      handle.setReveal(0);

      // Animate reveal 0→1 over ~6.5s
      const start = performance.now();
      const totalDuration = 6500;

      function animate() {
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / totalDuration);
        handle.setReveal(p);
        if (p < 1) {
          animId = requestAnimationFrame(animate);
        }
      }
      animId = requestAnimationFrame(animate);
    } else {
      // Fade out over 0.8s
      const fadeStart = performance.now();
      const fadeDuration = 800;

      function fadeOut() {
        const elapsed = performance.now() - fadeStart;
        const t = Math.min(1, elapsed / fadeDuration);
        handle.setReveal(1 - t);
        if (t < 1) {
          animId = requestAnimationFrame(fadeOut);
        }
      }
      animId = requestAnimationFrame(fadeOut);
    }

    return () => {
      if (animId != null) cancelAnimationFrame(animId);
    };
  }, [isAtTop, canvasReady]);

  return (
    <div className={`homepage-top-overlay${isAtTop ? " at-top" : ""}`} aria-hidden>
      <div className="homepage-glass" />
      <div className="homepage-ice-overlay">
        <IceThawCanvas ref={canvasRef} maxOpacity={0.12} onReady={handleReady} />
      </div>
    </div>
  );
}
