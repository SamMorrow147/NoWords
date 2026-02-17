"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Drip {
  x: number;
  y: number;
  length: number;
  width: number;
  wobble1: number;
  wobble2: number;
  group: number; // 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
}

function makeTriplet(
  anchorX: number,
  baseY: number,
  side: "left" | "right",
  group: number
): Drip[] {
  const spread = 6;
  const offsets =
    side === "left" ? [-spread, 0, spread] : [spread, 0, -spread];
  const lengths = [
    50 + Math.random() * 25,
    30 + Math.random() * 15,
    14 + Math.random() * 10,
  ];

  return offsets.map((ox, i) => ({
    x: anchorX + ox,
    y: baseY - 2 + Math.random() * 4,
    length: lengths[i],
    width: 1.4 + Math.random() * 1.2,
    wobble1: (Math.random() - 0.5) * 3,
    wobble2: (Math.random() - 0.5) * 2,
    group,
  }));
}

function dripPath(d: Drip): string {
  const { x, y, length, wobble1, wobble2 } = d;
  const third = length / 3;
  const cp1x = x + wobble1;
  const cp1y = y + third;
  const cp2x = x + wobble2;
  const cp2y = y + third * 2;
  const endY = y + length;
  return `M ${x} ${y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x + wobble2 * 0.3} ${endY}`;
}

export default function GraffitiDrips() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [drips, setDrips] = useState<Drip[]>([]);
  const [viewBox, setViewBox] = useState("0 0 400 200");
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const setPathRef = useCallback(
    (el: SVGPathElement | null, idx: number) => {
      pathRefs.current[idx] = el;
    },
    []
  );

  useEffect(() => {
    function measure() {
      const anchor = document.querySelector(".graffiti-drip-anchor");
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();

      const lines = anchor.querySelectorAll(".drip-line");
      const allDrips: Drip[] = [];

      lines.forEach((line, lineIdx) => {
        const lineRect = line.getBoundingClientRect();
        const baseY =
          lineRect.bottom - anchorRect.top - lineRect.height * 0.28;

        const first = line.querySelector(".drip-letter-first");
        const last = line.querySelector(".drip-letter-last");

        if (first) {
          const r = first.getBoundingClientRect();
          const extraLeft = lineIdx === 0 ? 5 : 0;
          const cx = r.left + r.width / 2 - anchorRect.left - 16 - extraLeft;
          const group = lineIdx === 0 ? 0 : 2; // top-left or bottom-left
          allDrips.push(...makeTriplet(cx, baseY, "left", group));
        }

        if (last) {
          const r = last.getBoundingClientRect();
          const cx = r.left + r.width / 2 - anchorRect.left + 16;
          const group = lineIdx === 0 ? 1 : 3; // top-right or bottom-right
          allDrips.push(...makeTriplet(cx, baseY, "right", group));
        }
      });

      setDrips(allDrips);
      setViewBox(`0 0 ${anchorRect.width} ${anchorRect.height + 120}`);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Build GSAP scroll-driven timeline once drips + path refs are ready
  useEffect(() => {
    if (drips.length === 0) return;

    // Wait a frame so path refs are populated
    const frameId = requestAnimationFrame(() => {
      const sectionFive = document.getElementById("section-five");
      if (!sectionFive) return;

      // Kill previous timeline
      if (tlRef.current) {
        tlRef.current.scrollTrigger?.kill();
        tlRef.current.kill();
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionFive,
          start: "top 60%",
          end: "top -30%",
          scrub: 0.5,
        },
      });

      // Group order: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
      // Text finishes ~0.45 of this extended range, drips start after
      const groupStartTimes = [0.48, 0.58, 0.68, 0.78];

      drips.forEach((d, i) => {
        const pathEl = pathRefs.current[i];
        if (!pathEl) return;

        const totalLen = d.length * 1.15;

        // Initialize: fully hidden stroke
        gsap.set(pathEl, {
          strokeDasharray: totalLen,
          strokeDashoffset: totalLen,
          opacity: 0,
        });

        const groupStart = groupStartTimes[d.group] ?? 0.25;
        // Stagger within each triplet (index within the group's 3 drips)
        const inGroupIdx = drips
          .filter((dd) => dd.group === d.group)
          .indexOf(d);
        const stagger = inGroupIdx * 0.03;

        tl.to(
          pathEl,
          { opacity: 1, duration: 0.02 },
          groupStart + stagger
        );
        tl.to(
          pathEl,
          {
            strokeDashoffset: 0,
            ease: "power1.inOut",
            duration: 0.18,
          },
          groupStart + stagger
        );
      });

      tlRef.current = tl;
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (tlRef.current) {
        tlRef.current.scrollTrigger?.kill();
        tlRef.current.kill();
      }
    };
  }, [drips]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "calc(100% + 120px)",
        overflow: "visible",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {drips.map((d, i) => {
        const path = dripPath(d);
        return (
          <path
            key={i}
            ref={(el) => setPathRef(el, i)}
            d={path}
            fill="none"
            stroke="white"
            strokeWidth={d.width}
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
        );
      })}
    </svg>
  );
}
