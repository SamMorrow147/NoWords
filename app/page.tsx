"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoHero from "@/components/LogoHero";
import ScrollBackground from "@/components/ScrollBackground";
import ZoomFigure from "@/components/ZoomFigure";
import HandwrittenText from "@/components/HandwrittenText";
import HeroTagline from "@/components/HeroTagline";
import SectionTwoWhatWePrint from "@/components/SectionTwoWhatWePrint";
import SectionThreeText from "@/components/SectionThreeText";
import SectionFourOrderCTA from "@/components/SectionFourOrderCTA";
import SectionFiveFoggyCorner from "@/components/SectionFiveFoggyCorner";
import HalftoneWaves from "@/components/HalftoneWaves";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionTwoBgRef = useRef<HTMLDivElement>(null);
  const sectionThreeBgRef = useRef<HTMLDivElement>(null);
  const squeegeeRef = useRef<HTMLDivElement>(null);
  const sectionFourBgRef = useRef<HTMLDivElement>(null);
  const sectionFiveBgRef = useRef<HTMLDivElement>(null);
  const beanieRef = useRef<HTMLDivElement>(null);
  const whiteFlashRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  // Prevent ScrollTrigger from recalculating when mobile address bar shows/hides
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, []);

  // Hero dark overlay: fade out as we scroll into section 2
  useEffect(() => {
    const overlay = heroOverlayRef.current;
    const sectionTwo = document.getElementById("section-two");
    if (!overlay || !sectionTwo) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionTwo,
        start: "top bottom",
        end: "top 50%",
        scrub: true,
      },
    });
    tl.to(overlay, { opacity: 0, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

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

  // Section 2→3: squeegee wipes left→right; section 3 appears at 100% behind squeegee
  useEffect(() => {
    const sectionThreeBg = sectionThreeBgRef.current;
    const squeegee = squeegeeRef.current;
    const sectionThree = document.getElementById("section-three");
    if (!sectionThreeBg || !sectionThree || !squeegee) return;

    const sw = squeegee.offsetWidth || 300;
    const vw = window.innerWidth;

    // Section 3 is full opacity but fully clipped (nothing visible yet), sits above section 2
    gsap.set(sectionThreeBg, { opacity: 1, zIndex: 2 });
    sectionThreeBg.style.clipPath = "inset(0 100% 0 0)";

    // Squeegee starts off-screen left, now safe to show
    gsap.set(squeegee, { x: -sw, visibility: "visible" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionThree,
        start: "top 250%",
        end: "top top",
        scrub: true,
      },
    });

    // Squeegee slides from off-screen left (-sw) to off-screen right (vw)
    tl.to(squeegee, {
      x: vw,
      ease: "none",
      onUpdate() {
        const currentX = gsap.getProperty(squeegee, "x") as number;
        // Reveal section 3 up to the squeegee's left edge
        const revealed = Math.max(0, Math.min(vw, currentX));
        const clipRight = vw - revealed;
        sectionThreeBg.style.clipPath = `inset(0 ${clipRight}px 0 0)`;
      },
    }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      sectionThreeBg.style.clipPath = "";
    };
  }, []);

  // Beanie: falls from top to center as you scroll between section 3 and 4 (into section 4)
  useEffect(() => {
    const beanie = beanieRef.current;
    const sectionFour = document.getElementById("section-four");
    if (!beanie || !sectionFour) return;

    gsap.set(beanie, { xPercent: -50, yPercent: -50, y: "-100vh", opacity: 1, force3D: true });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFour,
        start: "top 350%",
        end: "top -50%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(beanie, { xPercent: -50, yPercent: -50, y: "14vh", ease: "none", force3D: true });

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


  return (
    <div className="min-h-screen bg-[#3d3d3d]">
      {/* Section 2 background */}
      <div
        ref={sectionTwoBgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__topdown-macro-of-yellow-screen-printing-mesh-unifo__22836.png')`,
          zIndex: 1,
          opacity: 0,
        }}
        aria-hidden
      />

      {/* Section 3 background — solid black, clipped by squeegee wipe */}
      <div
        ref={sectionThreeBgRef}
        className="fixed inset-0 w-full h-full"
        style={{
          background: "#000000",
          zIndex: 2,
          opacity: 1,
          clipPath: "inset(0 100% 0 0)",
        }}
        aria-hidden
      />
      {/* Squeegee: full height, aspect ratio preserved (no squish on mobile) */}
      <div
        ref={squeegeeRef}
        className="fixed left-0 top-0 h-screen pointer-events-none"
        style={{ zIndex: 50, willChange: "transform", width: "max-content", visibility: "hidden" }}
        aria-hidden
      >
        <img
          src="/freepik__topdown-studio-photograph-of-tattooed-hands-holdin__69463.png"
          alt=""
          className="h-full w-auto max-h-screen block object-contain align-top"
          style={{ display: "block", minHeight: 0 }}
          draggable={false}
        />
      </div>
      {/* Section 4 background */}
      <div
        ref={sectionFourBgRef}
        className="section-four-bg fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/freepik__give-me-an-image-of-a-falling-folded-freshly-scree__51952.png')`,
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
          backgroundImage: `url('/freepik__at-risk-youth-learning-to-screen-print-in-a-studio__51953.png')`,
          zIndex: 3,
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
      {/* Section 6: foggy corner + socials */}
      <SectionFiveFoggyCorner />
      {/* Beanie: falls from top to center as section 3 scrolls up */}
      <div
        ref={beanieRef}
        className="fixed left-1/2 top-1/2 w-[min(92vw,520px)] xl:w-[min(58vw,820px)] aspect-[1] pointer-events-none z-10"
        style={{
          willChange: "transform",
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.35))",
          opacity: 0,
        }}
        aria-hidden
      >
        <img
          src="/freepik__give-me-an-image-of-a-falling-folded-freshly-scree__15202.png"
          alt=""
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      {/* Section 2: What We Print title + list */}
      <SectionTwoWhatWePrint />
      {/* Section 3 (black): "Local & Purpose-Driven" + supporting line after squeegee wipe */}
      <SectionThreeText />
      {/* Section 4: "Put in an order today" + Contact button */}
      <SectionFourOrderCTA />
      {/* Hero: full viewport, logo centered; on scroll logo moves to top-left */}
      <section className="relative min-h-screen">
        <HalftoneWaves />
        <ScrollBackground imagePath="/freepik__a-new-angle-of-this-print-shop-interior-next-to-sc__15802.png" />
        {/* Dark overlay to mute hero background (halftone + image); fades out on scroll */}
        <div
          ref={heroOverlayRef}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 2, background: "rgba(0,0,0,0.45)", opacity: 1 }}
          aria-hidden
        />
        <ZoomFigure imagePath="/CenterFigure.png" />
        <LogoHero />
        <HandwrittenText />
      </section>
      {/* Tagline: appears after logo moves and figure is in frame */}
      <HeroTagline />
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
    </div>
  );
}
