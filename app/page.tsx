"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoHero from "@/components/LogoHero";
import ScrollBackground from "@/components/ScrollBackground";
import PixelSnow from "@/components/PixelSnow";
import ZoomFigure from "@/components/ZoomFigure";
import HandwrittenText from "@/components/HandwrittenText";
import FoggyCorner from "@/components/FoggyCorner";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showSnow, setShowSnow] = useState(false);
  const snowRef = useRef<HTMLDivElement>(null);
  const sectionTwoBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start snow after logo animation completes (0.4s delay + 2.2s duration = 2.6s)
    const timer = setTimeout(() => {
      setShowSnow(true);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSnow && snowRef.current) {
      gsap.fromTo(
        snowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.inOut" }
      );
    }
  }, [showSnow]);

  // Fade in section 2 background only when approaching section 2
  useEffect(() => {
    const bg = sectionTwoBgRef.current;
    const sectionTwo = document.getElementById("section-two");
    if (!bg || !sectionTwo) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionTwo,
        start: "top bottom",
        end: "top 80%",
        scrub: true,
      },
    });

    tl.fromTo(bg, { opacity: 0 }, { opacity: 1, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1b001b]">
      {/* Section 2 background — hidden at first, fades in behind section 1 as you approach section 2 */}
      <div
        ref={sectionTwoBgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__a-young-ethnic-woman-in-a-purple-shirt-and-winter-__60532.png')`,
          zIndex: 0,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Hero: full viewport, logo centered; on scroll logo moves to top-left */}
      <section className="relative min-h-screen">
        <ScrollBackground imagePath="/Heroimage.png" />
        <ZoomFigure imagePath="/CenterFigure.png" />
        <FoggyCorner imagePath="/Heroimage.png" />
        {showSnow && (
          <div 
            ref={snowRef}
            className="fixed inset-0 pointer-events-none" 
            style={{ zIndex: 25, opacity: 0 }}
          >
            <PixelSnow 
              color="#ffffff"
              flakeSize={0.01}
              minFlakeSize={1.25}
              pixelResolution={400}
              speed={5}
              density={0.6}
              direction={125}
              brightness={1}
              depthFade={8}
              farPlane={20}
              gamma={0.4545}
              variant="snowflake"
            />
          </div>
        )}
        <LogoHero />
        <HandwrittenText />
      </section>
      {/* Spacer so first section animations complete before transition */}
      <div className="h-[100vh]" aria-hidden />
      {/* Section 2 — scrolling into this triggers the parallax exit */}
      <section id="section-two" className="relative min-h-[200vh]">
      </section>
    </div>
  );
}
