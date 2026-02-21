"use client";

import { useEffect, useRef } from "react";
import MaskButton from "./MaskButton";

export default function SectionFiveFoggyCorner() {
  const socialsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socials = socialsRef.current;
    const text = textRef.current;
    const lastSection = document.getElementById("section-five");
    if (!socials || !text || !lastSection) return;

    let rafId: number;
    let lastSocialsOp = 0;
    let lastTextOp = 0;

    function tick() {
      if (!socials || !text || !lastSection) return;
      const vh = window.innerHeight;
      const lastTop = lastSection.getBoundingClientRect().top;

      // After-school program text fades in as soon as last section enters (other content gone)
      const textStart = vh * 1.0;
      const textEnd = vh * 0.35;
      let textOp = 0;
      if (lastTop <= textEnd) {
        textOp = 1;
      } else if (lastTop < textStart) {
        textOp = 1 - (lastTop - textEnd) / (textStart - textEnd);
      }
      textOp = Math.max(0, Math.min(1, textOp));
      if (Math.abs(textOp - lastTextOp) > 0.001) {
        text.style.opacity = String(textOp);
        if (ctaBtnRef.current) {
          ctaBtnRef.current.style.pointerEvents = textOp > 0.1 ? "auto" : "none";
        }
        lastTextOp = textOp;
      }

      // Socials fade in later (section top ~15% → 0%)
      const socialsStart = vh * 0.15;
      const socialsEnd = vh * -0.05;

      let socialsOp = 0;
      if (lastTop <= socialsEnd) {
        socialsOp = 1;
      } else if (lastTop < socialsStart) {
        socialsOp = 1 - (lastTop - socialsEnd) / (socialsStart - socialsEnd);
      }
      socialsOp = Math.max(0, Math.min(1, socialsOp));

      if (Math.abs(socialsOp - lastSocialsOp) > 0.001) {
        socials.style.opacity = String(socialsOp);
        lastSocialsOp = socialsOp;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* After-school program text — last section, above socials */}
      <div
        ref={textRef}
        className="fixed inset-0 flex flex-col items-center justify-center px-6 pt-[20vh] pb-32 z-[45] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-white mb-6 md:mb-8"
            style={{
              fontFamily: "'Abject Failure', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(3rem, 11vw, 6rem)",
              lineHeight: 1.2,
              filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.5))",
            }}
          >
            Join our after school program
          </h2>
          <ul className="list-none p-0 m-0 text-left inline-block">
            {[
              "Learn real screen printing and embroidery",
              "Create your own clothing and merch",
              "Start your own brand ideas",
              "Work with professional equipment",
              "Turn creativity into real skills",
              "Be part of a creative studio community",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 mb-2"
                style={{
                  fontFamily: '"pressio-stencil-cond", sans-serif',
                  fontWeight: 600,
                  fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
                  color: "#ffffff",
                  filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.7))",
                }}
              >
                <svg
                  viewBox="0 0 526.5 313.9"
                  className="flex-shrink-0"
                  style={{ width: "1.1em", height: "0.65em", color: "#dc2626" }}
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M 439.23 184.4 L 0 158.74 L 85.94 28.65 L 478.02 139.65 Z" />
                  <path d="M 381.34 0 L 526.5 19.84 L 193.95 313.9 L 130.69 291.23 Z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div ref={ctaBtnRef} className="flex justify-center mt-8" style={{ pointerEvents: "none" }}>
            <MaskButton href="/contact" label="Contact" />
          </div>
        </div>
      </div>
      {/* Socials — left on mobile, right on md+; z-index above section 3/4 text */}
      <div
        ref={socialsRef}
        className="fixed bottom-0 left-0 right-auto flex items-center gap-6 pb-6 pl-6 pr-6 md:left-auto md:right-0 md:pl-0 md:pr-8 md:pb-8 pointer-events-auto z-[50]"
        style={{ opacity: 0 }}
        aria-label="Social links"
      >
        <a
          href="https://www.facebook.com/profile.php?id=61576968374104"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nowords Print Studio on Facebook"
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
          href="https://www.instagram.com/mrnowords_mplstp?igsh=eWs4MXczZThoN2Vr&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nowords Print Studio on Instagram"
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
