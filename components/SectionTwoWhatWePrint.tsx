"use client";

import { useEffect, useRef, Fragment } from "react";

const ROWS: [string, string][] = [
  ["T-Shirts", "Workwear"],
  ["Hoodies & Sweatshirts", "Youth Apparel"],
  ["Hats & Beanies", "Custom Merch"],
  ["Tote Bags", "Specialty Prints"],
];

// X icon paths (from Asset 2@8x.svg) – filled shapes, revealed with clip-path
const X_PATH_1 = "M 439.23 184.4 L 0 158.74 L 85.94 28.65 L 478.02 139.65 Z";
const X_PATH_2 = "M 381.34 0 L 526.5 19.84 L 193.95 313.9 L 130.69 291.23 Z";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 526.5 313.9"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <g className="x-shape-1-wrapper" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>
        <path d={X_PATH_1} />
      </g>
      <g className="x-shape-2-wrapper" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>
        <path d={X_PATH_2} />
      </g>
    </svg>
  );
}

export default function SectionTwoWhatWePrint() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const sectionTwo = document.getElementById("section-two");
    const sectionThree = document.getElementById("section-three");
    if (!container || !title || !sectionTwo || !sectionThree) return;

    const setClip = (el: Element, value: string) => {
      (el as HTMLElement).style.setProperty("clip-path", value);
      (el as HTMLElement).style.setProperty("-webkit-clip-path", value);
    };

    setClip(title, "inset(0 100% 0 0)");

    let rafId: number;

    function tick() {
      const vh = window.innerHeight;
      const s2Top = sectionTwo!.getBoundingClientRect().top;
      const s3Top = sectionThree!.getBoundingClientRect().top;

      const progressStart = vh * 0.9;
      const progressEnd = vh * -0.2;
      const progress = Math.max(
        0,
        Math.min(1, (progressStart - s2Top) / (progressStart - progressEnd))
      );

      const exitStart = vh * 0.85;
      const exitEnd = vh * 0.4;
      const exitProgress =
        s3Top >= exitStart ? 0 : s3Top <= exitEnd ? 1 : (exitStart - s3Top) / (exitStart - exitEnd);

      const containerOp = 1 - exitProgress;
      container!.style.opacity = String(containerOp);
      container!.style.visibility = containerOp > 0.01 ? "visible" : "hidden";

      if (containerOp < 0.01) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const titleP = Math.max(0, Math.min(1, progress / 0.08));
      setClip(title!, `inset(0 ${100 - titleP * 100}% 0 0)`);

      const itemStart = 0.4;
      const itemSpan = 0.55;
      const itemDuration = itemSpan / 8;

      for (let i = 0; i < 8; i++) {
        const wrapper = itemRefs.current[i];
        if (!wrapper) continue;

        const startP = itemStart + i * itemDuration;
        const p = Math.max(0, Math.min(1, (progress - startP) / itemDuration));

        const g1 = wrapper.querySelector<SVGGElement>(".x-shape-1-wrapper");
        const g2 = wrapper.querySelector<SVGGElement>(".x-shape-2-wrapper");
        const textEl = wrapper.querySelector<HTMLElement>(".item-text");

        const phaseLen = 1 / 3;
        const p1 = Math.max(0, Math.min(1, p / phaseLen));
        const p2 = Math.max(0, Math.min(1, (p - phaseLen) / phaseLen));
        const p3 = Math.max(0, Math.min(1, (p - 2 * phaseLen) / phaseLen));

        if (g1) setClip(g1, `inset(0 ${100 - p1 * 100}% 0 0)`);
        if (g2) setClip(g2, `inset(0 ${100 - p2 * 100}% 0 0)`);
        if (textEl) setClip(textEl, `inset(0 ${100 - p3 * 100}% 0 0)`);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center z-[1] pointer-events-none px-6"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div className="w-full max-w-2xl mx-auto text-left">
        <h2
          ref={titleRef}
          className="mb-10 md:mb-14 overflow-hidden whitespace-nowrap"
          style={{
            fontFamily: "'Abject Failure', sans-serif",
            fontWeight: 600,
            color: "#1e3a5f",
            fontSize: "clamp(3rem, 12vw, 6.5rem)",
          }}
        >
        What We Print
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-3 list-none p-0 m-0 w-full justify-items-start">
          {ROWS.map(([left, right], rowIndex) => (
            <Fragment key={left}>
              <li
                ref={(el) => {
                  itemRefs.current[rowIndex * 2] = el;
                }}
                className="flex items-center justify-start gap-2 text-left overflow-hidden col-span-2 md:col-span-1"
                style={{
                  fontFamily: '"pressio-stencil-cond", sans-serif',
                  fontWeight: 700,
                  fontSize: "clamp(1.85rem, 6vw, 2.25rem)",
                  color: "#1e3a5f",
                }}
              >
              <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 text-red-600">
                <XIcon className="w-full h-full block" />
              </span>
              <span className="item-text whitespace-nowrap" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>
                {left}
              </span>
            </li>
              <li
                ref={(el) => {
                  itemRefs.current[rowIndex * 2 + 1] = el;
                }}
                className="flex items-center justify-start gap-2 text-left overflow-hidden col-span-2 md:col-span-1"
                style={{
                  fontFamily: '"pressio-stencil-cond", sans-serif',
                  fontWeight: 700,
                  fontSize: "clamp(1.85rem, 6vw, 2.25rem)",
                  color: "#1e3a5f",
                }}
              >
                <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 text-red-600">
                  <XIcon className="w-full h-full block" />
                </span>
                <span className="item-text whitespace-nowrap" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>
                  {right}
                </span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
