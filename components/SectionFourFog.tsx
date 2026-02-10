"use client";

import { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_FOUR_IMAGE = "/freepik__an-image-outside-in-a-blizzard-at-a-big-box-of-the__64105.png";

function SectionFourFogInner(
  _props: Record<string, never>,
  forwardedRef: React.Ref<HTMLDivElement | null>
) {
  const fogRef = useRef<HTMLDivElement>(null);

  const setRef = (el: HTMLDivElement | null) => {
    (fogRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  useEffect(() => {
    const fog = fogRef.current;
    const sectionFour = document.getElementById("section-four");
    const sectionFive = document.getElementById("section-five");
    if (!fog || !sectionFour || !sectionFive) return;

    gsap.set(fog, { opacity: 0 });

    // Section 4: fog appears as the hat is falling (starts when section 4 enters). Section 5 dissolve is driven by the page timeline.
    const st4 = ScrollTrigger.create({
      id: "section-four-fog",
      trigger: sectionFour,
      start: "top bottom",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        const s5Rect = sectionFive.getBoundingClientRect();
        if (s5Rect.top < window.innerHeight) return; // section 5 in view — page timeline controls opacity
        fog.style.opacity = String(self.progress);
      },
    });

    return () => st4.kill();
  }, []);

  return (
    <div
      ref={setRef}
      className="section-four-fog fixed left-0 right-0 bottom-0 w-full h-[28vh] lg:h-[32vh] xl:h-[36vh] pointer-events-none"
      style={{
        zIndex: 2,
        opacity: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${SECTION_FOUR_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          filter: "blur(50px)",
          WebkitFilter: "blur(50px)",
        }}
      />
      {/* Fog gradient overlay — Safari-safe (no backdrop-filter + mask combo) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.05) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}

const SectionFourFog = forwardRef(SectionFourFogInner);
SectionFourFog.displayName = "SectionFourFog";
export default SectionFourFog;
