"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const ITEMS = [
  { img: "/T-T-CC copy.png", title: "MN Knux T", price: "$ 40.00" },
  { img: "/P-T-CC.png", title: "MN Knux T", price: "$ 40.00" },
  { img: "https://i.postimg.cc/5NfXQQs7/h5.png", title: "men's dickies\nlogo hoodie", price: "$ 40.00" },
  { img: "https://i.postimg.cc/50qxfnWx/h6.png", title: "men's dickies\nlogo hoodie", price: "$ 40.00" },
  { img: "https://i.postimg.cc/3J2ZYGdt/h3.png", title: "men's dickies\nlogo hoodie", price: "$ 40.00" },
  { img: "/HOTC-Sticker-min.png", title: "men's dickies\nlogo hoodie", price: "$ 40.00" },
];

const BGS = [
  "https://i.postimg.cc/y8y4gWrP/bg1.jpg",
  "https://i.postimg.cc/rmzvPjyn/bg2.jpg",
  "/freepik__dramatic-close-up-of-her-shirt-in-a-winter-storm__35141.png",
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

    /* ── Snap points ── */
    const cardW = cards.scrollWidth;
    const panelW = panel.offsetWidth;
    const maxDrag = Math.min(0, -(cardW - panelW + 40));
    const snapPoints = [0, maxDrag / 2, maxDrag];

    function switchBg(dragX: number) {
      const nearest = snapPoints.reduce(
        (best, _p, i) =>
          Math.abs(dragX - snapPoints[i]) < Math.abs(dragX - snapPoints[best])
            ? i
            : best,
        0
      );
      const bgIdx = [2, 1, 0][nearest];
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

      // Capture position before we take it out of flow
      const rect = item.getBoundingClientRect();

      // Insert spacer to keep list width
      const spacer = document.createElement("div");
      spacer.style.cssText = `width:${item.offsetWidth}px;height:${item.offsetHeight}px;flex-shrink:0;display:block;margin:${getComputedStyle(item).margin};`;
      item.parentNode?.insertBefore(spacer, item);
      spacerRef.current = spacer;

      // Move card to panel root (outside the transformed card-list)
      panel.appendChild(item);

      // Set it at its old visual position (now relative to panel since panel is the containing block)
      const panelRect = panel.getBoundingClientRect();
      const img = item.querySelector(".item-img") as HTMLElement;
      const desc = item.querySelector(".item-description") as HTMLElement;

      gsap.set(item, {
        position: "absolute",
        top: rect.top - panelRect.top,
        left: rect.left - panelRect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 1000,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      });

      // Animate card, image, and description together so nothing snaps
      const finalTop = panelRect.height - 360;
      const tl = gsap.timeline({ defaults: { duration: 0.55, ease: "power2.inOut" } });

      tl.to(item, {
        top: finalTop,
        left: 0,
        width: panelRect.width,
        height: 360,
        borderRadius: 0,
        boxShadow: "0 -8px 30px rgba(0,0,0,0.3)",
        onComplete: () => {
          item.classList.add("active");
        },
      }, 0);

      if (img) {
        tl.to(img, {
          maxWidth: "45%",
          bottom: 220,
        }, 0);
      }

      if (desc) {
        tl.to(desc, {
          bottom: 80,
        }, 0);
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

      const img = item.querySelector(".item-img") as HTMLElement;
      const desc = item.querySelector(".item-description") as HTMLElement;

      // Where should it go back?
      const spacerRect = spacer.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const tl = gsap.timeline({ defaults: { duration: 0.55, ease: "power2.inOut" } });

      tl.to(item, {
        top: spacerRect.top - panelRect.top,
        left: spacerRect.left - panelRect.left,
        width: spacerRect.width,
        height: spacerRect.height,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        onComplete: () => {
          // Put card back into the list and clear all inline styles
          gsap.set(item, { clearProps: "all" });
          if (img) gsap.set(img, { clearProps: "all" });
          if (desc) gsap.set(desc, { clearProps: "all" });
          spacer.parentNode?.insertBefore(item, spacer);
          spacer.parentNode?.removeChild(spacer);
          spacerRef.current = null;
          activeRef.current = null;
        },
      }, 0);

      if (img) {
        tl.to(img, {
          maxWidth: "100%",
          bottom: parseFloat(getComputedStyle(spacer).height) > 280 ? 160 : 100,
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

    const [draggable] = Draggable.create(cards, {
      type: "x",
      trigger: panel,
      edgeResistance: 0.65,
      bounds: { minX: maxDrag, maxX: 0 },
      zIndexBoost: false,
      allowContextMenu: false,
      minimumMovement: 6,
      onDragStart() {
        wasDragging = true;
      },
      onDragEnd() {
        const x = this.x;
        const nearest = snapPoints.reduce((best, pos) =>
          Math.abs(x - pos) < Math.abs(x - best) ? pos : best
        );
        gsap.to(cards, {
          x: nearest,
          duration: 0.4,
          ease: "power2.out",
        });
        switchBg(nearest);
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

    /* ── Resize handler ── */
    const handleResize = () => {
      const newPanelW = panel.offsetWidth;
      const newCardW = cards.scrollWidth;
      const newMax = Math.min(0, -(newCardW - newPanelW + 40));
      draggable.applyBounds({ minX: newMax, maxX: 0 });
      snapPoints[1] = newMax / 2;
      snapPoints[2] = newMax;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      draggable.kill();
      window.removeEventListener("resize", handleResize);
      items.forEach((el) => {
        el?.removeEventListener("click", handleCardClick as EventListener);
      });
      panel.removeEventListener("click", handlePanelClick);
    };
  }, []);

  return (
    <div className="drops-page fixed inset-0 w-full h-full overflow-hidden">
      {/* ── Full-screen backgrounds ── */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        {BGS.map((url, i) => (
          <div
            key={i}
            ref={(el) => { bgRefs.current[i] = el; }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: i === 2 ? "150%" : "cover",
              backgroundPosition: i === 2 ? "center 65%" : "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>

      {/* ── Main panel ── */}
      <main
        ref={panelRef}
        className="drops-panel relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
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
            New SEASON - 020
          </p>
        </aside>

        {/* Card list – GSAP Draggable moves this via transform */}
        <div
          ref={cardsRef}
          className="drops-card-list absolute bottom-8 left-3 flex gap-3 md:gap-5 lg:gap-6 z-10"
        >
          {ITEMS.map((product, index) => (
            <div
              key={index}
              ref={(el) => { itemEls.current[index] = el; }}
              className="drops-item relative flex flex-col justify-center items-center w-[170px] h-[220px] md:w-[260px] md:h-[320px] lg:w-[300px] lg:h-[360px] rounded-xl bg-white flex-shrink-0 cursor-pointer shadow-lg"
            >
              <img
                className={`item-img absolute max-w-full h-auto bottom-[100px] md:bottom-[140px] lg:bottom-[160px] block pointer-events-none ${index < 2 ? "scale-[1.65] origin-bottom" : ""}`}
                src={product.img}
                alt={product.title.replace("\n", " ")}
                draggable={false}
              />
              {index >= 2 && (
                <span
                  className="absolute left-1/2 top-[12%] flex flex-col items-center justify-center text-red-600 font-bold pointer-events-none select-none text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight"
                  style={{ fontFamily: "'Abject Failure', sans-serif", transform: "translate(-50%, -50%) rotate(-25deg)" }}
                  aria-hidden
                >
                  <span>SOLD</span>
                  <span>OUT</span>
                </span>
              )}
              <div className="item-description absolute bottom-0 text-center w-full pointer-events-none">
                <h2 className="uppercase px-4 pt-4 text-sm font-semibold leading-tight text-[#1b001b]">
                  {product.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
                <p className="px-4 pb-4 text-gray-500 text-sm font-sans">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
