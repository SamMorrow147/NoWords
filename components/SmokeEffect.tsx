"use client";

import { useEffect, useRef } from "react";

const LIFE = 5000;
const BIRTH_INTERVAL = 200;
const MIN_SIZE = 50;
const MAX_SIZE = 100;
const MAX_PARTICLES = 80;
const THICKNESS = 100;

export default function SmokeEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentParticlesRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const sectionFive = document.getElementById("section-five");
    if (!container || !sectionFive) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentParticlesRef.current = 0;
          intervalRef.current = setInterval(() => {
            const cur = currentParticlesRef.current;
            if (cur >= MAX_PARTICLES || !container) return;

            const smoke = document.createElement("div");
            smoke.className = "smoke-particle";

            const size = Math.floor(MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE + 1));
            const direction = Math.floor(-300 + Math.random() * 700);

            smoke.style.width = `${size}px`;
            smoke.style.height = `${size}px`;
            smoke.style.filter = `blur(${(size * THICKNESS) / 100}px)`;
            smoke.style.setProperty("--sx", `${direction}px`);

            container.appendChild(smoke);
            currentParticlesRef.current = cur + 1;

            setTimeout(() => {
              smoke.remove();
              currentParticlesRef.current = Math.max(0, currentParticlesRef.current - 1);
            }, LIFE);
          }, BIRTH_INTERVAL);
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionFive);
    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smoke-rise {
          0% { opacity: 1; transform: translate(var(--sx, 0), 0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--sx, 0), -1200px); }
        }
        .smoke-particle {
          background: #8b5cf6;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          bottom: 0;
          pointer-events: none;
          animation: smoke-rise 2s linear forwards;
        }
      ` }} />
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden
      />
    </>
  );
}
