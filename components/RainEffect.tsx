"use client";

import { useState, useEffect } from "react";

const IMAGE_URL = "/freepik__can-you-give-me-an-image-of-a-lifestyle-brand-prod__50246.png";

interface DropConfig {
  w: number;
  h: number;
  x: number;
  y: number;
  d: number;
}

interface FallingDropConfig {
  w: number;
  h: number;
  x: number;
  duration: number;
  delay: number;
}

function makeDropConfigs(isMobile: boolean): DropConfig[] {
  const count = isMobile ? 80 : 240;
  const configs: DropConfig[] = [];
  for (let i = 0; i < count; i++) {
    const size = 3 + Math.random() * 10;
    const stretch = 1 + Math.random() * 0.8;
    configs.push({
      w: size,
      h: size * stretch,
      x: Math.random() * 100,
      y: Math.random() * 100,
      d: i * 0.05 + Math.random() * 0.5,
    });
  }
  return configs;
}

function makeFallingConfigs(isMobile: boolean): FallingDropConfig[] {
  const count = isMobile ? 20 : 35;
  const configs: FallingDropConfig[] = [];
  // Base delay so falling starts after static droplets have filled the screen (~8–18s)
  const baseDelay = 8;
  const stagger = 10;
  for (let i = 0; i < count; i++) {
    const size = 3 + Math.random() * 10;
    const stretch = 1 + Math.random() * 0.8;
    configs.push({
      w: size,
      h: size * stretch,
      x: Math.random() * 100,
      duration: 1.5 + Math.random() * 2.5,
      delay: baseDelay + Math.random() * stagger,
    });
  }
  return configs;
}

/**
 * Glass raindrops: static droplets that pop in with refracted background
 * (same image + background-attachment: fixed) and glass box-shadow.
 */
export default function RainEffect() {
  const [configs, setConfigs] = useState<DropConfig[] | null>(null);
  const [fallingConfigs, setFallingConfigs] = useState<FallingDropConfig[] | null>(null);

  useEffect(() => {
    const sectionFive = document.getElementById("section-five");
    if (!sectionFive) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const isMobile = window.innerWidth < 768;
        setConfigs(makeDropConfigs(isMobile));
        setFallingConfigs(makeFallingConfigs(isMobile));
        observer.disconnect();
      },
      { threshold: 0.25 }
    );
    observer.observe(sectionFive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="rain-glass" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: `
        .rain-glass {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .rain-glass .raindrops {
          position: absolute;
          inset: 0;
          z-index: 2;
        }
        .rain-glass .raindrops--falling {
          z-index: 3;
          pointer-events: none;
        }
        .rain-glass .raindrop {
          position: absolute;
          width: var(--w);
          height: var(--h);
          left: var(--x);
          top: var(--y);
          border-radius: 50%;
          background-image: url("${IMAGE_URL}");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          box-shadow:
            inset -1px -2px 4px rgba(255,255,255,0.25),
            inset 2px 3px 6px rgba(0,0,0,0.5),
            0 4px 10px rgba(0,0,0,0.35);
          opacity: 0;
          transform: scale(1.8);
          animation: dropIn 0.3s ease forwards;
          animation-delay: var(--d);
          will-change: transform, opacity;
        }
        @keyframes dropIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .rain-glass .raindrop--falling {
          opacity: 1;
          transform: scale(1);
          top: -10vh;
          animation: fallDown var(--duration) linear var(--delay) infinite;
        }
        @keyframes fallDown {
          to {
            transform: translate(18vh, 100vh) scale(1);
          }
        }
        @media (max-width: 768px) {
          .rain-glass .raindrop {
            box-shadow:
              inset -1px -1px 3px rgba(255,255,255,0.2),
              inset 1px 2px 4px rgba(0,0,0,0.4);
          }
        }
      ` }} />
      {configs !== null && (
        <div className="raindrops">
          {configs.map((c, i) => (
            <div
              key={`s-${i}`}
              className="raindrop"
              style={{
                "--w": `${c.w}px`,
                "--h": `${c.h}px`,
                "--x": `${c.x}vw`,
                "--y": `${c.y}vh`,
                "--d": `${c.d}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      {fallingConfigs !== null && (
        <div className="raindrops raindrops--falling">
          {fallingConfigs.map((c, i) => (
            <div
              key={`f-${i}`}
              className="raindrop raindrop--falling"
              style={{
                "--w": `${c.w}px`,
                "--h": `${c.h}px`,
                "--x": `${c.x}vw`,
                "--duration": `${c.duration}s`,
                "--delay": `${c.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}
