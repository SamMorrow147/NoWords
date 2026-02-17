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
import HomepageTopIce from "@/components/HomepageTopIce";
import HeroScrollIce from "@/components/HeroScrollIce";
import SmokeEffect from "@/components/SmokeEffect";
import SectionFiveFoggyCorner from "@/components/SectionFiveFoggyCorner";
import SectionFiveMadeByHand from "@/components/SectionFiveMadeByHand";
import FluorescentFlicker from "@/components/FluorescentFlicker";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showSnow, setShowSnow] = useState(false);
  const snowRef = useRef<HTMLDivElement>(null);
  const sectionTwoBgRef = useRef<HTMLDivElement>(null);
  const sectionThreeBgRef = useRef<HTMLDivElement>(null);
  const sectionFourBgRef = useRef<HTMLDivElement>(null);
  const sectionFiveBgRef = useRef<HTMLDivElement>(null);
  const sectionSixBgRef = useRef<HTMLDivElement>(null);
  const rainContainerRef = useRef<HTMLDivElement>(null);
  const beanieRef = useRef<HTMLDivElement>(null);
  const whiteFlashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start snow after logo animation completes (0.4s delay + 2.2s duration = 2.6s)
    const timer = setTimeout(() => {
      const sectionFive = document.getElementById("section-five");
      if (sectionFive) {
        const rect = sectionFive.getBoundingClientRect();
        // If already scrolled to the last section, don't start snow (e.g. after refresh at bottom)
        if (rect.top < window.innerHeight * 0.75) return;
      }
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

  // Beanie: falls from top to center as you scroll between section 3 and 4 (into section 4)
  useEffect(() => {
    const beanie = beanieRef.current;
    const sectionFour = document.getElementById("section-four");
    if (!beanie || !sectionFour) return;

    gsap.set(beanie, { xPercent: -50, yPercent: -50, y: "-100vh", force3D: true });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFour,
        start: "top bottom",
        end: "top -80%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(beanie, { xPercent: -50, yPercent: -50, y: "-12vh", ease: "none", force3D: true });

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

  // Section 5: white fade transition - section 4 fades out, white flash peaks, then section 5 fades in.
  useEffect(() => {
    const sectionFourBg = sectionFourBgRef.current;
    const sectionFiveBg = sectionFiveBgRef.current;
    const whiteFlash = whiteFlashRef.current;
    const beanie = beanieRef.current;
    const sectionFive = document.getElementById("section-five");
    if (!sectionFourBg || !sectionFiveBg || !whiteFlash || !beanie || !sectionFive) return;

    const fog = document.querySelector(".section-four-fog") as HTMLElement | null;
    const dropsText = document.querySelector(".section-four-drops") as HTMLElement | null;
    const topOverlay = document.querySelector(".homepage-top-overlay") as HTMLElement | null;
    const heroScrollIce = document.querySelector(".hero-scroll-ice") as HTMLElement | null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFive,
        start: "top bottom",
        end: "top 30%",
        scrub: true,
      },
    });

    // Fade out section 4 layers while white rises
    tl.to(sectionFourBg, { opacity: 0, ease: "none", duration: 0.4 }, 0);
    tl.to(beanie, { opacity: 0, ease: "none", duration: 0.4 }, 0);
    if (fog) tl.to(fog, { opacity: 0, ease: "none", duration: 0.4 }, 0);
    if (dropsText) tl.to(dropsText, { opacity: 0, ease: "none", duration: 0.4 }, 0);
    if (topOverlay) tl.to(topOverlay, { opacity: 0, ease: "none", duration: 0.3 }, 0);
    if (heroScrollIce) tl.to(heroScrollIce, { opacity: 0, ease: "none", duration: 0.3 }, 0);

    // White flash: ramp up then fade out
    tl.to(whiteFlash, { opacity: 1, ease: "power2.in", duration: 0.5 }, 0);
    tl.to(whiteFlash, { opacity: 0, ease: "power2.out", duration: 0.5 }, 0.5);

    // Section 5 bg fades in under the white
    tl.to(sectionFiveBg, { opacity: 1, ease: "none", duration: 0.5 }, 0.3);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Section 6: dissolve section 5 content and reveal section 6; smoke fades in on last section.
  useEffect(() => {
    const sectionFiveBg = sectionFiveBgRef.current;
    const sectionSixBg = sectionSixBgRef.current;
    const smokeContainer = rainContainerRef.current;
    const sectionSix = document.getElementById("section-six");
    if (!sectionFiveBg || !sectionSixBg || !sectionSix) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionSix,
        start: "top 140%",
        end: "top 30%",
        scrub: true,
      },
    });

    tl.to(sectionFiveBg, { opacity: 0, ease: "none" }, 0);
    tl.to(sectionSixBg, { opacity: 1, ease: "none" }, 0);
    if (smokeContainer) tl.to(smokeContainer, { opacity: 1, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Section 5: stop snow when you reach the bottom (fade out with the rest of the dissolve).
  useEffect(() => {
    if (!showSnow) return;
    const snow = snowRef.current;
    const sectionFive = document.getElementById("section-five");
    if (!snow || !sectionFive) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFive,
        start: "top bottom",
        end: "top 45%",
        scrub: true,
      },
    });

    tl.to(snow, { opacity: 0, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [showSnow]);

  return (
    <div className="min-h-screen bg-[#1b001b]">
      {/* Section 2 background */}
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
      {/* Section 3 background */}
      <div
        ref={sectionThreeBgRef}
        className="section-three-bg fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__close-up-product-shot-of-this-necklace-swinging-ou__60531.png')`,
          zIndex: 1,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 4 background */}
      <div
        ref={sectionFourBgRef}
        className="section-four-bg fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__an-image-outside-in-a-blizzard-at-a-big-box-of-the__64105.png')`,
          zIndex: 1,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 5 background */}
      <div
        ref={sectionFiveBgRef}
        className="section-five-bg fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__a-sketchy-screen-printing-shop-in-a-small-ghetto-s__60529.png')`,
          zIndex: 0,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 6 background */}
      <div
        ref={sectionSixBgRef}
        className="section-six-bg fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__can-you-give-me-an-image-of-a-lifestyle-brand-prod__50246.png')`,
          zIndex: 0,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* White flash overlay for section 4 to 5 transition */}
      <div
        ref={whiteFlashRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 10, opacity: 0, background: "#ffffff" }}
        aria-hidden
      />
      {/* Smoke effect (last section only) */}
      <div
        ref={rainContainerRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5, opacity: 0 }}
        aria-hidden
      >
        <SmokeEffect />
      </div>
      {/* Section 5: flickering fluorescent ceiling light */}
      <FluorescentFlicker />
      {/* Section 5: "Made by Hand In Minneapolis" with scroll-driven reveal */}
      <SectionFiveMadeByHand />
      {/* Section 6: foggy corner + socials */}
      <SectionFiveFoggyCorner />
      {/* Beanie: falls from top to center as section 3 scrolls up */}
      <div
        ref={beanieRef}
        className="fixed left-1/2 top-1/2 w-[min(85vw,420px)] xl:w-[min(50vw,700px)] aspect-[1] pointer-events-none z-10"
        style={{
          willChange: "transform",
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.35))",
        }}
        aria-hidden
      >
        <img
          src="/freepik__a-black-beanie-product-image-on-a-white-background__36577.png"
          alt=""
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      {/* Section 2: fog along bottom + "You Betcha!" text */}
      <SectionTwoFog />
      <SectionTwoText />
      {/* Section 3: circular fog on the right + "Shop Steel" text */}
      <SectionThreeFoggyCorner />
      <SectionThreeText />
      {/* Section 4: fog + "drop offs" text */}
      <SectionFourFog />
      <SectionFourText />
      {/* Ice overlay when at top of page */}
      <HomepageTopIce />
      {/* Hero: full viewport, logo centered; on scroll logo moves to top-left */}
      <section className="relative min-h-screen">
        <ScrollBackground imagePath="/Heroimage.png" />
        <ZoomFigure imagePath="/CenterFigure.png" />
        <FoggyCorner imagePath="/Heroimage.png" />
        <HeroScrollIce />
        {showSnow && (
          <div 
            ref={snowRef}
            className="fixed inset-0 pointer-events-none" 
            style={{ zIndex: 30, opacity: 0 }}
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
      <section id="section-two" className="relative min-h-[200vh]">
      </section>
      <section id="section-three" className="relative min-h-[200vh]">
      </section>
      <section id="section-four" className="relative min-h-[200vh]">
      </section>
      <section id="section-five" className="relative min-h-[200vh]">
      </section>
      <section id="section-six" className="relative min-h-[100vh]">
      </section>
    </div>
  );
}
