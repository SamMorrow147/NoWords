"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import LogoHero from "@/components/LogoHero";
import ScrollBackground from "@/components/ScrollBackground";
import PixelSnow from "@/components/PixelSnow";
import ZoomFigure from "@/components/ZoomFigure";
import HandwrittenText from "@/components/HandwrittenText";
import FoggyCorner from "@/components/FoggyCorner";

export default function Home() {
  const [showSnow, setShowSnow] = useState(false);
  const snowRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-[#1b001b]">
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
              pixelResolution={200}
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
      {/* Spacer so the page is scrollable; replace with your content (e.g. CollectionSection) */}
      <div className="h-[150vh]" aria-hidden />
    </div>
  );
}
