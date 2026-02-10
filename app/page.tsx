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
import RainEffect from "@/components/RainEffect";
import SectionFiveFoggyCorner from "@/components/SectionFiveFoggyCorner";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showSnow, setShowSnow] = useState(false);
  const snowRef = useRef<HTMLDivElement>(null);
  const sectionTwoBgRef = useRef<HTMLDivElement>(null);
  const sectionThreeBgRef = useRef<HTMLDivElement>(null);
  const sectionFourBgRef = useRef<HTMLDivElement>(null);
  const sectionFiveBgRef = useRef<HTMLDivElement>(null);
  const rainContainerRef = useRef<HTMLDivElement>(null);
  const beanieRef = useRef<HTMLDivElement>(null);

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
        end: "top -80%",  // longer scroll range = slower drop
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

  // Section 5: dissolve section 4 content (image, hat, fog, drops text, ice) and reveal section 5 image in one timeline.
  useEffect(() => {
    const sectionFourBg = sectionFourBgRef.current;
    const sectionFiveBg = sectionFiveBgRef.current;
    const beanie = beanieRef.current;
    const sectionFive = document.getElementById("section-five");
    if (!sectionFourBg || !sectionFiveBg || !beanie || !sectionFive) return;

    const fog = document.querySelector(".section-four-fog") as HTMLElement | null;
    const dropsText = document.querySelector(".section-four-drops") as HTMLElement | null;
    const topOverlay = document.querySelector(".homepage-top-overlay") as HTMLElement | null;
    const heroScrollIce = document.querySelector(".hero-scroll-ice") as HTMLElement | null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFive,
        start: "top bottom",
        end: "top 45%",
        scrub: true,
      },
    });

    // All at position 0: fade out section 4 layers + frost overlays, fade in section 5 (last image only).
    // Fog and drops text fade out over the same longer range so they don’t disappear instantly.
    tl.to(sectionFourBg, { opacity: 0, ease: "none" }, 0);
    tl.to(beanie, { opacity: 0, ease: "none" }, 0);
    if (fog) tl.to(fog, { opacity: 0, ease: "none" }, 0);
    if (dropsText) tl.to(dropsText, { opacity: 0, ease: "none" }, 0);
    if (topOverlay) tl.to(topOverlay, { opacity: 0, ease: "none" }, 0);
    if (heroScrollIce) tl.to(heroScrollIce, { opacity: 0, ease: "none" }, 0);
    tl.to(sectionFiveBg, { opacity: 1, ease: "none" }, 0);
    const rainContainer = rainContainerRef.current;
    if (rainContainer) tl.to(rainContainer, { opacity: 1, ease: "none" }, 0);

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
          zIndex: 1,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 5 background — only visible after section 4 content dissolves (last image only) */}
      <div
        ref={sectionFiveBgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__can-you-give-me-an-image-of-a-lifestyle-brand-prod__50246.png')`,
          zIndex: 0,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Section 5: rain effect on the last section only (no buttons/containers) */}
      <div
        ref={rainContainerRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5, opacity: 0 }}
        aria-hidden
      >
        <RainEffect />
      </div>
      {/* Section 5: foggy bottom-right + socials (same image/style as other fog corners) */}
      <SectionFiveFoggyCorner />
      {/* Beanie: falls from top to center as section 3 scrolls up */}
      <div
        ref={beanieRef}
        className="fixed left-1/2 top-1/2 w-[min(85vw,420px)] aspect-[1] pointer-events-none z-10"
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
      {/* Ice overlay when at top of page — same creep-in as nav; disappears on scroll down, replays on scroll back up */}
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
      {/* Section 2 — scrolling into this triggers the parallax exit */}
      <section id="section-two" className="relative min-h-[200vh]">
      </section>
      {/* Section 3 — scrolling into this slides section 2 image right, revealing necklace */}
      <section id="section-three" className="relative min-h-[200vh]">
      </section>
      {/* Section 4 — scrolling into this slides section 3 (necklace) up, revealing screen-printing image */}
      <section id="section-four" className="relative min-h-[200vh]">
      </section>
      {/* Section 5 — scrolling into this dissolves section 4; minimal extra scroll so it stops after icons appear */}
      <section id="section-five" className="relative min-h-[100vh]">
      </section>
    </div>
  );
}
