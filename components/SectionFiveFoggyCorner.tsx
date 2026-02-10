"use client";

import { useEffect, useRef } from "react";

const SECTION_FIVE_IMAGE =
  "/freepik__can-you-give-me-an-image-of-a-lifestyle-brand-prod__50246.png";

export default function SectionFiveFoggyCorner() {
  const fogRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fog = fogRef.current;
    const socials = socialsRef.current;
    const sectionFive = document.getElementById("section-five");
    if (!fog || !socials || !sectionFive) return;

    let rafId: number;
    let lastOpacity = 0;

    function tick() {
      if (!fog || !socials || !sectionFive) return;
      const vh = window.innerHeight;
      const s5Top = sectionFive.getBoundingClientRect().top;

      const inStart = vh * 0.75;
      const inEnd = vh * 0.4;

      let opacity = 0;
      if (s5Top <= inEnd) {
        opacity = 1;
      } else if (s5Top < inStart) {
        opacity = 1 - (s5Top - inEnd) / (inStart - inEnd);
      }

      opacity = Math.max(0, Math.min(1, opacity));

      if (Math.abs(opacity - lastOpacity) > 0.001) {
        fog.style.opacity = String(opacity);
        socials.style.opacity = String(opacity);
        lastOpacity = opacity;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .section-five-fog-mask {
            mask-image: radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%);
            -webkit-mask-image: radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%);
          }
        }
        @media (min-width: 768px) {
          .section-five-fog-mask {
            mask-image: radial-gradient(ellipse 120% 140% at bottom right, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%);
            -webkit-mask-image: radial-gradient(ellipse 120% 140% at bottom right, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%);
          }
        }
      ` }} />
      {/* Fog only — left on mobile, right on md+; z-index 4 so rain draws in front */}
      <div
        ref={fogRef}
        className="fixed bottom-0 left-0 right-auto w-[50vw] h-[26vh] md:left-auto md:right-0 md:w-[32vw] md:h-[30vh] pointer-events-none"
        style={{ zIndex: 4, opacity: 0 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${SECTION_FIVE_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(50px)",
            WebkitFilter: "blur(50px)",
          }}
        />
        <div
          className="section-five-fog-mask"
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          className="section-five-fog-mask"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.28)",
          }}
        />
      </div>
      {/* Socials — left on mobile, right on md+; z-index above section 3/4 text so taps hit icons not metal/drops */}
      <div
        ref={socialsRef}
        className="fixed bottom-0 left-0 right-auto flex items-center gap-6 pb-6 pl-6 pr-6 md:left-auto md:right-0 md:pl-0 md:pr-8 md:pb-8 pointer-events-auto z-[50]"
        style={{ opacity: 0 }}
        aria-label="Social links"
      >
        <a
          href="https://www.facebook.com/profile.php?id=100090307900335"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cold Culture on Facebook"
          className="opacity-60 transition-opacity duration-300 hover:opacity-100"
        >
          <img
            src="/facebook-3.svg"
            alt=""
            width={64}
            height={64}
            className="block w-16 h-16 brightness-0 invert"
          />
        </a>
        <a
          href="https://www.instagram.com/shopcoldculture"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cold Culture on Instagram"
          className="opacity-60 transition-opacity duration-300 hover:opacity-100"
        >
          <img
            src="/instagram-2.svg"
            alt=""
            width={64}
            height={64}
            className="block w-16 h-16 brightness-0 invert"
          />
        </a>
      </div>
    </>
  );
}
