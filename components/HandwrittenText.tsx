"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HandwrittenText() {
  const svgRef = useRef<SVGSVGElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const pattern = patternRef.current;
    if (!svg || !pattern) return;

    // Calculate pattern offset to align with page background
    const updatePatternPosition = () => {
      const rect = svg.getBoundingClientRect();
      // Offset pattern to align with viewport background
      pattern.setAttribute("x", `${-rect.left}`);
      pattern.setAttribute("y", `${-rect.top}`);
    };

    updatePatternPosition();
    window.addEventListener("resize", updatePatternPosition);
    window.addEventListener("scroll", updatePatternPosition);

    const maskPaths = Array.from(svg.querySelectorAll<SVGPathElement>(".mask-path"));

    // Set up stroke drawing for mask paths
    maskPaths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    gsap.set(svg, { opacity: 0 });

    // Animate when scrolling to very bottom - fade in then draw (replays each time)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "85% bottom",
        toggleActions: "play reset play reset",
        markers: false, // Set to true for debugging
        id: "handwriting",
      },
    });

    // First fade in the SVG
    tl.to(svg, {
      opacity: 1,
      duration: 0.3,
    });

    // Natural handwriting: variable speed per letter with slight overlaps
    const letterTimings = [
      { duration: 0.5, ease: "power1.inOut", overlap: "-=0.1" },   // N
      { duration: 0.2, ease: "power1.in", overlap: "-=0.05" },     // i (quick)
      { duration: 0.4, ease: "power1.inOut", overlap: "-=0.1" },   // c
      { duration: 0.3, ease: "power1.out", overlap: "-=0.1" },     // e
      { duration: 0.1, ease: "none", overlap: "+=0.2" },           // pause before "Right"
      { duration: 0.6, ease: "power1.in", overlap: "-=0.05" },     // R (slower, emphasized)
      { duration: 0.2, ease: "power1.inOut", overlap: "-=0.08" },  // i (quick)
      { duration: 0.4, ease: "power1.inOut", overlap: "-=0.1" },   // g
      { duration: 0.35, ease: "power1.inOut", overlap: "-=0.1" },  // h
      { duration: 0.25, ease: "power1.out", overlap: "-=0.08" },   // t
      { duration: 0.4, ease: "power2.out", overlap: "-=0.05" },    // ?
    ];

    maskPaths.forEach((path, i) => {
      const timing = letterTimings[i] || { duration: 0.3, ease: "none", overlap: 0 };
      
      tl.to(path, {
        strokeDashoffset: 0,
        duration: timing.duration,
        ease: timing.ease,
      }, timing.overlap || 0);
    });

    // Separate fade out when scrolling back up
    const fadeOutTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "85% bottom",
      onLeaveBack: () => {
        gsap.to(svg, { opacity: 0, duration: 0.3 });
      },
    });

    return () => {
      window.removeEventListener("resize", updatePatternPosition);
      window.removeEventListener("scroll", updatePatternPosition);
      tl.scrollTrigger?.kill();
      fadeOutTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed bottom-12 left-12 z-40 pointer-events-none">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 76.02 54.85"
        className="w-48 md:w-64"
        style={{
          transform: "rotate(5deg)",
          filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.5))",
        }}
      >
        <defs>
          {/* Pattern to fill text with the clear background image - sized to viewport */}
          <pattern ref={patternRef} id="clear-bg-pattern" x="0" y="0" width="100vw" height="100vh" patternUnits="userSpaceOnUse">
            <image 
              href="/Heroimage.png" 
              x="0" 
              y="0" 
              width="100vw" 
              height="100vh" 
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>

          <mask id="handwriting-mask" maskUnits="userSpaceOnUse">
            {/* Mask paths that draw out - revealing the text below */}
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M8.28,0l.7.33.99,5.66,3.29,16.1c.17.81-.15,1.29-.96,1.45l-.31.06c-1.3.26-4.25-3.56-8.83-11.48l-.16.03c.3,4.08.64,7.03,1.01,8.82l.43,2.12c.33,1.63.04,2.53-.86,2.72-.81.17-1.38-.56-1.72-2.19l-.31-1.52C.38,13.17-.14,8.33.03,7.62s.61-1.15,1.32-1.3l.45-.09c.76.27,2.31,2.44,4.65,6.49l3.06,4.92.16-.03-1.18-5.77C7.17,4.19,7,.26,7.99.06l.3-.06Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M20.7,4.89c.54-.03.83.12.9.43l.08.4c.09.44.76.51-2.44,1.94l-.51.31.04.19,1.53,8.12,2.22-1.28c.66-.85,3.33-.1,1.81,1.66l-7.05,3.81c-.63.54-1.68,1.02-2.23-.05l-.08-.4c-.13-.65.5-1.27,1.91-1.82l.13-.03.89-.75-.32-.96-1.14-7.37c-1.77-.93-2.31,3.17-4.08-.19.48-1.16,1.26-1.81,6.8-3.68l1.55-.32Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M30.7,4l1.22-.25.85.55.14.7c.01.35-.71.99-2.16,1.91-1.68,1.84-2.6,3.61-2.75,5.29l-.14,1.13.03.17c.95.66,2.32.81,4.11.44l2.79-.57.43.28.14.7c-.13.75-1.79,1.58-4.97,2.47-3.06-.1-4.71-.49-4.97-1.17s-.44-1.25-.53-1.71c.26-3.19,1.44-5.99,3.57-8.38l2.23-1.55Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M43.81.63c.76.18,1.22.58,1.35,1.23.35.86-1.56,2.37-5.73,4.55l-.14,2.18c2.27-1.13,3.96-1.81,5.08-2.04l.57.63.2.96c-.2.43-2.2,1.77-6,3.98l.23,1,1.61-.62,2.64-1.05c.85-.17,1.39.3,1.62,1.42.14.69-1.12,1.69-3.78,3.03-2.32.47-4.06-.17-5.23-1.94l-.1-.48c-.54-2.66-.47-4.76.24-6.33-.71-.18-1.13-.43-1.25-.75l-.25-1.21c.1-1.03,1.49-1.8,4.14-2.35l4.82-2.24Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M10.73,28.81c2.83-.45,4.96-.25,6.42.61l1.08.69.67,1.18c.87,2.5.84,4.44-.11,5.81s-3.06,3.18-6.35,5.44c-1.08.38-1.42,1.13-1.03,2.27,6.3,1.32,10.34,2.44,12.13,3.39l.73.51.24.68c-.13.68-.41,1.1-.84,1.25l-12.6-2.66c-.15,4.13-.87,6.42-2.16,6.87l-1.11-.57-.06-.17c-.14-.39-.06-2.77.23-7.14-1.33-.67-2.09-1.29-2.3-1.87l-.18-.51c-.35-.99.52-2,2.6-3.02.48-.17.6-1.92.35-5.27-.15-1.73.17-2.73.95-3,.89.11,1.43.42,1.62.96l.59,5.34.16-.06c3.48-2.32,5.14-4.71,4.99-7.17l-.48-.35c-1.8-.76-3.37-.9-4.73-.43-5.02,1.98-7.36,3.49-6.99,4.54.09.27-.11.53-.63.8-1.86.27-2.86.18-3.02-.27l-.3-.85c-.31-.89,2.11-2.83,7.28-5.8l2.86-1.2Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M27.77,30.51c.53-.1.84,0,.95.3l.13.38c.15.43.83.41-2.16,2.25l-.47.38.06.18,2.62,7.84,2.03-1.57c.54-.93,3.28-.55,2.01,1.4l-6.47,4.72c-.55.62-1.53,1.24-2.21.25l-.13-.38c-.22-.63.33-1.32,1.65-2.06l.13-.04.78-.86-.45-.91-2.12-7.15c-1.88-.68-1.86,3.45-4.07.36.32-1.21,1-1.97,6.24-4.57l1.49-.52Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M37.95,28.62l.83-.29c.62-.22,1.31-.03,2.08.58l.35,1c-.09.66-.43,1.09-1.04,1.3l-1.29.08c-1.75,1.38-2.8,2.99-3.16,4.86l.12.89.06.17c1.87,1.63,3.82,1.14,5.85-1.5l-.17.06-2.22,1.16c-.58-.05-.94-.18-1.07-.38l-.23-.66c.21-1.07,1.83-2.14,4.87-3.2.51-.01.95.15,1.29.48l.23.66-.7,5.49c.32.92.15,1.49-.52,1.73l-.5.18c-.67-.14-1.11-.49-1.3-1.05l-.08-1.31-2,1.26c-2.56.9-4.62.18-6.18-2.15l-.06-.17c-.78-2.23.37-5.01,3.46-8.33l1.38-.85Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M47.79,27.95l.65,3.01,3.23-1.13-.34-2.11c-.45-2.53-.51-3.85-.18-3.96l.72-.25c.62.1,1.14.46,1.58,1.06l.91,4.32c.62.03,1.01.17,1.15.4l.31.9c.11.31-.32.8-1.3,1.46.41,2.23.37,4.2-.15,5.9l-.73.25c-.57-.08-.91-.3-1.03-.66l-.79-4.55-.83.5-2.15.75c.44,1.27.21,2.89-.71,4.87l-.54.19-.97-.46c-.01-1.17-.57-4.13-1.69-8.87l-.81-1.73c-.27-.78.09-1.45,1.11-2.01,1.08-.38,1.94.33,2.56,2.12Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M59.46,21.09c2-.7,3.12-.7,3.37,0,.28.81-.58,1.57-2.58,2.27l.23.9.43,1.22c1.58,5.45,1.74,8.4.5,8.84-.59.21-1.16-.31-1.75-1.54l-1.18-6.82-.41-1.35c-.83.37-1.34,1.11-1.52,2.22l-.47.16c-.58,0-1.09-.66-1.56-1.99l-.06-.18c.27-1.1,1.19-2.08,2.76-2.94l2.27-.77Z"
            />
            <path
              className="mask-path"
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              d="M67.71,9.81c3.79-.13,6.43,1.21,7.94,4.01l.36,2.05c.05,1.5-2.14,3.55-6.57,6.13h-.15c.64,1.49.97,2.56.99,3.21-.12,1.28-.53,1.94-1.26,1.97-.79-.23-1.2-.62-1.22-1.15l.11-1.18c-.16-.87-.74-1.88-1.72-3.04-.02-.72,1.27-1.65,3.88-2.78l3.58-3.22c-.06-1.85-1.43-3.03-4.1-3.54l-1.92-.09c-2.24.67-3.39,1.49-3.46,2.48.24.7.88,1.62,1.9,2.76l-.4.57-.59.51c-1.3-.37-2.34-1.63-3.11-3.77v-.29c-.07-1.7,1.56-3.18,4.85-4.44l.88-.18ZM69.44,30.69c.7.42,1.06.89,1.08,1.43l.02.73c-.08.25-.55.66-1.43,1.24l-.88.03c-.88.03-1.34-.35-1.36-1.14v-.29c-.05-1.28.47-1.93,1.54-1.96l1.03-.03Z"
            />
          </mask>
        </defs>

        {/* The actual filled text (revealed by the mask) - filled with clear background image */}
        <g mask="url(#handwriting-mask)">
          <path fill="url(#clear-bg-pattern)" d="M8.28,0l.7.33.99,5.66,3.29,16.1c.17.81-.15,1.29-.96,1.45l-.31.06c-1.3.26-4.25-3.56-8.83-11.48l-.16.03c.3,4.08.64,7.03,1.01,8.82l.43,2.12c.33,1.63.04,2.53-.86,2.72-.81.17-1.38-.56-1.72-2.19l-.31-1.52C.38,13.17-.14,8.33.03,7.62s.61-1.15,1.32-1.3l.45-.09c.76.27,2.31,2.44,4.65,6.49l3.06,4.92.16-.03-1.18-5.77C7.17,4.19,7,.26,7.99.06l.3-.06Z"/>
          <path fill="url(#clear-bg-pattern)" d="M20.7,4.89c.54-.03.83.12.9.43l.08.4c.09.44.76.51-2.44,1.94l-.51.31.04.19,1.53,8.12,2.22-1.28c.66-.85,3.33-.1,1.81,1.66l-7.05,3.81c-.63.54-1.68,1.02-2.23-.05l-.08-.4c-.13-.65.5-1.27,1.91-1.82l.13-.03.89-.75-.32-.96-1.14-7.37c-1.77-.93-2.31,3.17-4.08-.19.48-1.16,1.26-1.81,6.8-3.68l1.55-.32Z"/>
          <path fill="url(#clear-bg-pattern)" d="M30.7,4l1.22-.25.85.55.14.7c.01.35-.71.99-2.16,1.91-1.68,1.84-2.6,3.61-2.75,5.29l-.14,1.13.03.17c.95.66,2.32.81,4.11.44l2.79-.57.43.28.14.7c-.13.75-1.79,1.58-4.97,2.47-3.06-.1-4.71-.49-4.97-1.17s-.44-1.25-.53-1.71c.26-3.19,1.44-5.99,3.57-8.38l2.23-1.55Z"/>
          <path fill="url(#clear-bg-pattern)" d="M43.81.63c.76.18,1.22.58,1.35,1.23.35.86-1.56,2.37-5.73,4.55l-.14,2.18c2.27-1.13,3.96-1.81,5.08-2.04l.57.63.2.96c-.2.43-2.2,1.77-6,3.98l.23,1,1.61-.62,2.64-1.05c.85-.17,1.39.3,1.62,1.42.14.69-1.12,1.69-3.78,3.03-2.32.47-4.06-.17-5.23-1.94l-.1-.48c-.54-2.66-.47-4.76.24-6.33-.71-.18-1.13-.43-1.25-.75l-.25-1.21c.1-1.03,1.49-1.8,4.14-2.35l4.82-2.24Z"/>
          <path fill="url(#clear-bg-pattern)" d="M10.73,28.81c2.83-.45,4.96-.25,6.42.61l1.08.69.67,1.18c.87,2.5.84,4.44-.11,5.81s-3.06,3.18-6.35,5.44c-1.08.38-1.42,1.13-1.03,2.27,6.3,1.32,10.34,2.44,12.13,3.39l.73.51.24.68c-.13.68-.41,1.1-.84,1.25l-12.6-2.66c-.15,4.13-.87,6.42-2.16,6.87l-1.11-.57-.06-.17c-.14-.39-.06-2.77.23-7.14-1.33-.67-2.09-1.29-2.3-1.87l-.18-.51c-.35-.99.52-2,2.6-3.02.48-.17.6-1.92.35-5.27-.15-1.73.17-2.73.95-3,.89.11,1.43.42,1.62.96l.59,5.34.16-.06c3.48-2.32,5.14-4.71,4.99-7.17l-.48-.35c-1.8-.76-3.37-.9-4.73-.43-5.02,1.98-7.36,3.49-6.99,4.54.09.27-.11.53-.63.8-1.86.27-2.86.18-3.02-.27l-.3-.85c-.31-.89,2.11-2.83,7.28-5.8l2.86-1.2Z"/>
          <path fill="url(#clear-bg-pattern)" d="M27.77,30.51c.53-.1.84,0,.95.3l.13.38c.15.43.83.41-2.16,2.25l-.47.38.06.18,2.62,7.84,2.03-1.57c.54-.93,3.28-.55,2.01,1.4l-6.47,4.72c-.55.62-1.53,1.24-2.21.25l-.13-.38c-.22-.63.33-1.32,1.65-2.06l.13-.04.78-.86-.45-.91-2.12-7.15c-1.88-.68-1.86,3.45-4.07.36.32-1.21,1-1.97,6.24-4.57l1.49-.52Z"/>
          <path fill="url(#clear-bg-pattern)" d="M37.95,28.62l.83-.29c.62-.22,1.31-.03,2.08.58l.35,1c-.09.66-.43,1.09-1.04,1.3l-1.29.08c-1.75,1.38-2.8,2.99-3.16,4.86l.12.89.06.17c1.87,1.63,3.82,1.14,5.85-1.5l-.17.06-2.22,1.16c-.58-.05-.94-.18-1.07-.38l-.23-.66c.21-1.07,1.83-2.14,4.87-3.2.51-.01.95.15,1.29.48l.23.66-.7,5.49c.32.92.15,1.49-.52,1.73l-.5.18c-.67-.14-1.11-.49-1.3-1.05l-.08-1.31-2,1.26c-2.56.9-4.62.18-6.18-2.15l-.06-.17c-.78-2.23.37-5.01,3.46-8.33l1.38-.85Z"/>
          <path fill="url(#clear-bg-pattern)" d="M47.79,27.95l.65,3.01,3.23-1.13-.34-2.11c-.45-2.53-.51-3.85-.18-3.96l.72-.25c.62.1,1.14.46,1.58,1.06l.91,4.32c.62.03,1.01.17,1.15.4l.31.9c.11.31-.32.8-1.3,1.46.41,2.23.37,4.2-.15,5.9l-.73.25c-.57-.08-.91-.3-1.03-.66l-.79-4.55-.83.5-2.15.75c.44,1.27.21,2.89-.71,4.87l-.54.19-.97-.46c-.01-1.17-.57-4.13-1.69-8.87l-.81-1.73c-.27-.78.09-1.45,1.11-2.01,1.08-.38,1.94.33,2.56,2.12Z"/>
          <path fill="url(#clear-bg-pattern)" d="M59.46,21.09c2-.7,3.12-.7,3.37,0,.28.81-.58,1.57-2.58,2.27l.23.9.43,1.22c1.58,5.45,1.74,8.4.5,8.84-.59.21-1.16-.31-1.75-1.54l-1.18-6.82-.41-1.35c-.83.37-1.34,1.11-1.52,2.22l-.47.16c-.58,0-1.09-.66-1.56-1.99l-.06-.18c.27-1.1,1.19-2.08,2.76-2.94l2.27-.77Z"/>
          <path fill="url(#clear-bg-pattern)" d="M67.71,9.81c3.79-.13,6.43,1.21,7.94,4.01l.36,2.05c.05,1.5-2.14,3.55-6.57,6.13h-.15c.64,1.49.97,2.56.99,3.21-.12,1.28-.53,1.94-1.26,1.97-.79-.23-1.2-.62-1.22-1.15l.11-1.18c-.16-.87-.74-1.88-1.72-3.04-.02-.72,1.27-1.65,3.88-2.78l3.58-3.22c-.06-1.85-1.43-3.03-4.1-3.54l-1.92-.09c-2.24.67-3.39,1.49-3.46,2.48.24.7.88,1.62,1.9,2.76l-.4.57-.59.51c-1.3-.37-2.34-1.63-3.11-3.77v-.29c-.07-1.7,1.56-3.18,4.85-4.44l.88-.18ZM69.44,30.69c.7.42,1.06.89,1.08,1.43l.02.73c-.08.25-.55.66-1.43,1.24l-.88.03c-.88.03-1.34-.35-1.36-1.14v-.29c-.05-1.28.47-1.93,1.54-1.96l1.03-.03Z"/>
        </g>
      </svg>
    </div>
  );
}
