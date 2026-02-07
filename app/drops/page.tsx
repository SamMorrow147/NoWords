"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const ITEMS = [
  { img: "/T-T-CC copy.png", title: "MN Knux T", price: "$ 40" },
  { img: "/P-T-CC.png", title: "MN Knux T", price: "$ 40" },
  { img: "/KnuxKeychain.png", title: "Knux Keychain", price: "$ 40" },
  { img: "/KnuckNecklace.png", title: "Knux Necklace", price: "$ 40" },
  { img: "/Knuxearings.png", title: "Knux Earrings", price: "$ 40" },
  { img: "/freepik__minimal-soft-studio-light-photography-this-tank-to__85476.png", title: "CC Tank", price: "$ 40" },
  { img: "/HOTC-Sticker-min.png", title: "Heart of the City", price: "$ 40" },
];

const BGS = [
  "/freepik__can-you-give-me-an-close-up-image-of-this-small-5-__41049.png",
  "/freepik__a-product-shot-of-earrings-on-a-beautiful-ethnic-w__60530.png",
  "/freepik__dramatic-close-up-of-her-shirt-in-a-winter-storm-v__35142.png",
];

export default function DropsPage() {
  const panelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const cards = cardsRef.current;
    const bgs = bgRefs.current;
    if (!panel || !cards) return;

    /* ── Background init: only bg3 visible ── */
    if (bgs[0]) gsap.set(bgs[0], { scale: 2, opacity: 0 });
    if (bgs[1]) gsap.set(bgs[1], { scale: 2, opacity: 0 });
    if (bgs[2]) gsap.set(bgs[2], { scale: 1, opacity: 1 });

    /* ── Per-card snap points ── */
    const cardEls = Array.from(cards.children) as HTMLElement[];
    const panelW = panel.offsetWidth;

    function calcSnapPoints() {
      const pts: number[] = [];
      for (let i = 0; i < cardEls.length; i++) {
        // Snap position centers each card in the viewport
        const cardLeft = cardEls[i].offsetLeft;
        const cardWidth = cardEls[i].offsetWidth;
        const centerOffset = -(cardLeft - (panelW - cardWidth) / 2);
        pts.push(centerOffset);
      }
      return pts;
    }

    let snapPoints = calcSnapPoints();

    function getActiveSnapIndex(dragX: number) {
      return snapPoints.reduce(
        (best, _p, i) =>
          Math.abs(dragX - snapPoints[i]) < Math.abs(dragX - snapPoints[best])
            ? i
            : best,
        0
      );
    }

    function switchBg(cardIdx: number) {
      // Map card index to one of the 3 backgrounds
      // First third → bg 2, middle third → bg 1, last third → bg 0
      const total = cardEls.length;
      let bgIdx: number;
      if (cardIdx < total / 3) bgIdx = 2;
      else if (cardIdx < (2 * total) / 3) bgIdx = 1;
      else bgIdx = 0;

      gsap.to(bgs, {
        scale: (i: number) => (i === bgIdx ? 1 : 2),
        opacity: (i: number) => (i === bgIdx ? 1 : 0),
        duration: 0.4,
        ease: "power2.out",
      });
    }

    /* ── Activate card ── */
    function activate(index: number) {
      if (activeRef.current !== null) return;
      if (!panel) return;
      const item = itemEls.current[index];
      if (!item) return;

      activeRef.current = index;

      const rect = item.getBoundingClientRect();

      // Spacer keeps the card-list width stable
      const spacer = document.createElement("div");
      spacer.style.cssText = `width:${item.offsetWidth}px;height:${item.offsetHeight}px;flex-shrink:0;display:block;margin:${getComputedStyle(item).margin};`;
      item.parentNode?.insertBefore(spacer, item);
      spacerRef.current = spacer;

      // Move card out of the draggable list so it's not affected by transforms
      panel.appendChild(item);

      const panelRect = panel.getBoundingClientRect();

      // Place card at its old visual position
      gsap.set(item, {
        position: "absolute",
        top: rect.top - panelRect.top,
        left: rect.left - panelRect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 1000,
        overflow: "visible",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      });

      const img = item.querySelector(".item-img") as HTMLElement;
      const desc = item.querySelector(".item-description") as HTMLElement;
      const price = item.querySelector(".item-price") as HTMLElement;
      const buyBtn = item.querySelector(".item-buy-btn") as HTMLElement;

      // Animate card to expanded bottom strip
      const expandedHeight = 420;
      const finalTop = panelRect.height - expandedHeight;
      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

      tl.to(item, {
        top: finalTop,
        left: 0,
        width: panelRect.width,
        height: expandedHeight,
        overflow: "visible",
        borderRadius: 0,
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.3)",
        onComplete: () => {
          item.classList.add("active");
        },
      }, 0);

      if (img) {
        // Fix image width to its collapsed card size and center it
        // so it doesn't grow when the card expands to full width
        gsap.set(img, {
          width: rect.width,
          left: "50%",
          right: "auto",
          xPercent: -50,
        });
        tl.to(img, {
          bottom: 220,
        }, 0);
      }

      if (desc) {
        tl.to(desc, {
          bottom: 130,
        }, 0);
      }

      // Reveal price + button with a staggered fade-in
      if (price) {
        gsap.set(price, { display: "block", opacity: 0 });
        tl.to(price, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.25);
      }
      if (buyBtn) {
        gsap.set(buyBtn, { display: "block", opacity: 0 });
        tl.to(buyBtn, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.35);
      }
    }

    /* ── Deactivate card ── */
    function deactivate() {
      const idx = activeRef.current;
      if (idx === null || !panel) return;
      const item = itemEls.current[idx];
      const spacer = spacerRef.current;
      if (!item || !spacer) return;

      item.classList.remove("active");

      const spacerRect = spacer.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const img = item.querySelector(".item-img") as HTMLElement;
      const desc = item.querySelector(".item-description") as HTMLElement;
      const price = item.querySelector(".item-price") as HTMLElement;
      const buyBtn = item.querySelector(".item-buy-btn") as HTMLElement;

      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

      // Fade out price + button immediately
      if (price) {
        tl.to(price, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);
      }
      if (buyBtn) {
        tl.to(buyBtn, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);
      }

      tl.to(item, {
        top: spacerRect.top - panelRect.top,
        left: spacerRect.left - panelRect.left,
        width: spacerRect.width,
        height: spacerRect.height,
        overflow: "visible",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        onComplete: () => {
          gsap.set(item, { clearProps: "all" });
          if (img) gsap.set(img, { clearProps: "all" });
          if (desc) gsap.set(desc, { clearProps: "all" });
          if (price) gsap.set(price, { clearProps: "all" });
          if (buyBtn) gsap.set(buyBtn, { clearProps: "all" });
          spacer.parentNode?.insertBefore(item, spacer);
          spacer.parentNode?.removeChild(spacer);
          spacerRef.current = null;
          activeRef.current = null;
        },
      }, 0);

      if (img) {
        tl.to(img, {
          bottom: 72,
        }, 0);
      }

      if (desc) {
        tl.to(desc, {
          bottom: 0,
        }, 0);
      }
    }

    /* ── GSAP Draggable ── */
    let wasDragging = false;
    let currentSnapIdx = 0;

    const minSnap = snapPoints[snapPoints.length - 1];
    const maxSnap = snapPoints[0];

    const [draggable] = Draggable.create(cards, {
      type: "x",
      trigger: panel,
      edgeResistance: 0.65,
      bounds: { minX: minSnap - 40, maxX: maxSnap + 40 },
      zIndexBoost: false,
      allowContextMenu: false,
      minimumMovement: 6,
      onDragStart() {
        wasDragging = true;
      },
      onDragEnd() {
        const x = this.x;
        const nearestIdx = getActiveSnapIndex(x);
        currentSnapIdx = nearestIdx;
        gsap.to(cards, {
          x: snapPoints[nearestIdx],
          duration: 0.4,
          ease: "power2.out",
        });
        switchBg(nearestIdx);
        // Reset drag flag after a tick so the click event that follows is suppressed
        setTimeout(() => { wasDragging = false; }, 80);
      },
    });

    /* ── Native click handlers on each card (more reliable than Draggable onClick) ── */
    function handleCardClick(e: MouseEvent) {
      if (wasDragging) return;
      e.stopPropagation();

      const card = (e.currentTarget as HTMLElement).closest(".drops-item") as HTMLDivElement | null;
      if (!card) return;
      const idx = itemEls.current.indexOf(card);
      if (idx < 0) return;

      // Sold out cards don't open
      if (card.classList.contains("drops-item-sold-out")) return;

      if (activeRef.current === idx) {
        deactivate();
      } else if (activeRef.current === null) {
        activate(idx);
      }
    }

    // Attach click listeners to each card
    const items = itemEls.current;
    items.forEach((el) => {
      el?.addEventListener("click", handleCardClick as EventListener);
    });

    /* ── Click anywhere else to close an active card ── */
    function handlePanelClick(e: MouseEvent) {
      if (wasDragging) return;
      if (activeRef.current === null) return;
      const target = e.target as HTMLElement;
      // Only close if the click isn't on a card, button, or link
      if (target.closest(".drops-item") || target.closest("button") || target.closest("a")) return;
      deactivate();
    }
    panel.addEventListener("click", handlePanelClick);

    /* ── Mouse wheel scrolls through cards ── */
    let wheelLocked = false;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (activeRef.current !== null) return; // ignore when a card is open
      if (wheelLocked) return;

      // Use deltaY (vertical scroll) or deltaX (horizontal scroll/trackpad)
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 5) return;

      if (delta > 0 && currentSnapIdx < snapPoints.length - 1) {
        currentSnapIdx++;
      } else if (delta < 0 && currentSnapIdx > 0) {
        currentSnapIdx--;
      } else {
        return;
      }

      wheelLocked = true;
      gsap.to(cards, {
        x: snapPoints[currentSnapIdx],
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          draggable.update();
          setTimeout(() => { wheelLocked = false; }, 150);
        },
      });
      switchBg(currentSnapIdx);
    }

    panel.addEventListener("wheel", handleWheel, { passive: false });

    /* ── Resize handler ── */
    const handleResize = () => {
      snapPoints = calcSnapPoints();
      const newMin = snapPoints[snapPoints.length - 1];
      const newMax = snapPoints[0];
      draggable.applyBounds({ minX: newMin - 40, maxX: newMax + 40 });
      // Re-snap to nearest card after resize
      const nearestIdx = getActiveSnapIndex(draggable.x);
      gsap.to(cards, { x: snapPoints[nearestIdx], duration: 0.3 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      draggable.kill();
      window.removeEventListener("resize", handleResize);
      items.forEach((el) => {
        el?.removeEventListener("click", handleCardClick as EventListener);
      });
      panel.removeEventListener("click", handlePanelClick);
      panel.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="drops-page drops-page-root">
      {/* ── Full-screen backgrounds: fixed + inset 0 (no height) so mobile viewport is correct ── */}
      <div className="drops-bg-wrap">
        {BGS.map((url, i) => (
          <div
            key={i}
            ref={(el) => { bgRefs.current[i] = el; }}
            className={`drops-bg-layer ${i === 2 ? "drops-bg-layer-third" : ""}`}
          >
            <img
              src={url}
              alt=""
              className={i === 2 ? "drops-bg-img drops-bg-img-third" : "drops-bg-img"}
              draggable={false}
              fetchPriority={i === 2 ? "high" : "low"}
            />
          </div>
        ))}
      </div>

      {/* Black transparent overlay over background */}
      <div className="drops-bg-overlay" aria-hidden />

      {/* ── Main panel ── */}
      <main
        ref={panelRef}
        className="drops-panel relative z-10 w-full h-full overflow-visible cursor-grab active:cursor-grabbing select-none"
      >
        {/* Dark backdrop when a product is open – makes the product pop */}
        <div className="drops-active-backdrop" aria-hidden />
        {/* Header */}
        <header className="relative z-20 flex justify-center items-center px-4 py-3 text-white bg-black/20 backdrop-blur-sm">
          <a href="/" className="flex justify-center items-center" aria-label="Cold Culture home">
            <img
              src="/ColdCulture.svg"
              alt="Cold Culture"
              className="h-8 md:h-9 w-auto brightness-0 invert"
            />
          </a>
        </header>

        {/* Hero */}
        <aside className="relative z-10 px-6 pb-5 mt-8">
          <p className="font-sans uppercase text-white text-sm tracking-wider">
            New SEASON - 025
          </p>
        </aside>

        {/* Card list – GSAP Draggable moves this via transform */}
        <div
          ref={cardsRef}
          className="drops-card-list absolute bottom-8 left-0 flex gap-3 md:gap-5 lg:gap-6 z-10 overflow-visible px-[12.5vw] md:px-3"
        >
          {ITEMS.map((product, index) => (
            <div
              key={index}
              ref={(el) => { itemEls.current[index] = el; }}
              className={`drops-item drops-item-foggy drops-card relative w-[75vw] h-[220px] md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[280px] rounded-xl flex-shrink-0 shadow-lg overflow-visible ${index >= 5 ? "drops-item-sold-out cursor-not-allowed" : "cursor-pointer"}`}
            >
              <img
                className={`item-img absolute inset-x-0 bottom-[72px] w-full object-contain object-bottom ${index < 2 ? "scale-[1.65] origin-bottom" : ""}`}
                src={product.img}
                alt={product.title.replace("\n", " ")}
                draggable={false}
              />
              {index >= 5 && (
                <span
                  className="absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2 -rotate-[25deg] flex flex-col items-center justify-center text-red-600/50 font-bold pointer-events-none select-none text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight"
                  style={{ fontFamily: "'Abject Failure', sans-serif" }}
                  aria-hidden
                >
                  Sold Out
                </span>
              )}
              <div className="item-description absolute bottom-0 inset-x-0 h-[72px] text-center w-full pointer-events-none flex flex-col justify-start pt-1">
                <h2 className={`px-3 pt-2 md:pt-3 text-lg md:text-xl lg:text-2xl font-semibold leading-snug capitalize ${index >= 5 ? "text-gray-400" : "text-white"}`} style={{ fontFamily: "'Abject Failure', sans-serif" }}>
                  {product.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
                <p className="item-price mt-3 md:mt-4 px-3 pb-2 md:pb-3 text-gray-300 text-sm font-sans">
                  {product.price}
                </p>
                {index < 5 && (
                  <button
                    className="item-buy-btn neon-glass-btn pointer-events-auto mx-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
