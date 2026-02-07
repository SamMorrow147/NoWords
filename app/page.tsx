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
import SectionTwoFog from "@/components/SectionTwoFog";
import SectionTwoText from "@/components/SectionTwoText";
import SectionFourFog from "@/components/SectionFourFog";
import SectionFourText from "@/components/SectionFourText";
import SectionThreeFoggyCorner from "@/components/SectionThreeFoggyCorner";
import SectionThreeText from "@/components/SectionThreeText";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showSnow, setShowSnow] = useState(false);
  const snowRef = useRef<HTMLDivElement>(null);
  const sectionTwoBgRef = useRef<HTMLDivElement>(null);
  const sectionThreeBgRef = useRef<HTMLDivElement>(null);
  const sectionFourBgRef = useRef<HTMLDivElement>(null);

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

  // Section 3: slide section 2 image right and show necklace (third image)
  useEffect(() => {
    const sectionTwoBg = sectionTwoBgRef.current;
    const sectionThreeBg = sectionThreeBgRef.current;
    const sectionThree = document.getElementById("section-three");
    if (!sectionTwoBg || !sectionThreeBg || !sectionThree) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionThree,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    tl.to(sectionTwoBg, { x: "100vw", ease: "none" }, 0);
    tl.to(sectionThreeBg, { opacity: 1, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Section 4: section 3 (necklace) scrolls up to reveal screen-printing image
  useEffect(() => {
    const sectionThreeBg = sectionThreeBgRef.current;
    const sectionFourBg = sectionFourBgRef.current;
    const sectionFour = document.getElementById("section-four");
    if (!sectionThreeBg || !sectionFourBg || !sectionFour) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFour,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    tl.to(sectionThreeBg, { y: "-100vh", ease: "none" }, 0);
    tl.to(sectionFourBg, { opacity: 1, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1b001b]">
      {/* Section 2 background — hidden at first, fades in; later slides right to reveal section 3 */}
      <div
        ref={sectionTwoBgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__at-night-city-lights-purples-and-yellow-light-cast__39381.png')`,
          zIndex: 1,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 3 background — only visible when section 3; later scrolls up to reveal section 4 */}
      <div
        ref={sectionThreeBgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__close-up-product-shot-of-this-necklace-swinging-ou__60531.png')`,
          zIndex: 1,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 4 background — behind section 3, revealed when section 3 scrolls up */}
      <div
        ref={sectionFourBgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__an-image-outside-in-a-blizzard-at-a-big-box-of-the__64105.png')`,
          zIndex: 0,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 2: fog along bottom + "You Betcha!" text */}
      <SectionTwoFog />
      <SectionTwoText />
      {/* Section 3: circular fog on the right + "Shop Steel" text */}
      <SectionThreeFoggyCorner />
      <SectionThreeText />
      {/* Section 4: fog + "drop offs" text */}
      <SectionFourFog />
      <SectionFourText />
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
      {/* Section 3 — scrolling into this slides section 2 image right, revealing necklace */}
      <section id="section-three" className="relative min-h-[200vh]">
      </section>
      {/* Section 4 — scrolling into this slides section 3 (necklace) up, revealing screen-printing image */}
      <section id="section-four" className="relative min-h-[200vh]">
      </section>
    </div>
  );
}
