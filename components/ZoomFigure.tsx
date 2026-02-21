"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function ZoomFigure({
  imagePath = "/CenterFigure.png",
}: {
  imagePath?: string;
}) {
  const figureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const isMobile = window.innerWidth < 768;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const figW = isMobile ? 720 : 900;
    const figH = isMobile ? 960 : 1200;
    const startX = vw * 0.8;
    const startY = vh * 1.1;
    const endX = isMobile ? vw * 0.55 : vw * 0.6;
    const endScale = isMobile ? 0.88 : 0.9;
    const endY = isMobile ? vh + figH * (1 - endScale) : vh * 1.15;

    gsap.set(figure, {
      position: "fixed",
      left: 0,
      top: 0,
      width: `${figW}px`,
      height: `${figH}px`,
      x: startX,
      y: startY,
      xPercent: -50,
      yPercent: -100,
      scale: 3,
      transformOrigin: "top left",
      zIndex: 20,
      opacity: 0,
      visibility: "hidden",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: figure.parentElement ?? document.body,
        start: "top top-=200",
        end: "+=500",
        scrub: true,
      },
    });

    tl.to(figure, { opacity: 1, visibility: "visible", duration: 0.1 })
      .to(figure, { 
        x: endX, 
        y: endY, 
        scale: endScale,
        xPercent: -50,
        yPercent: -100,
        duration: 1,
        ease: "none"
      }, 0);

    const sectionTwo = document.getElementById("section-two");
    let exitTl: gsap.core.Timeline | undefined;
    if (sectionTwo) {
      exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionTwo,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      exitTl.fromTo(
        figure,
        { x: endX },
        { x: -600, immediateRender: false, ease: "none" }
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      exitTl?.scrollTrigger?.kill();
      exitTl?.kill();
    };
  }, []);

  return (
    <div
      ref={figureRef}
      style={{ opacity: 0, visibility: "hidden" }}
      className="overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt="Center Figure"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
