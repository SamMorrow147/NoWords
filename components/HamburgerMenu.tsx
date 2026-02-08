"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./HamburgerMenu.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/drops", label: "Drops" },
];

export default function HamburgerMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggled, setToggled] = useState(false);
  const iceRef = useRef<HTMLDivElement>(null);
  const iceLeftRef = useRef<HTMLDivElement>(null);
  const iceRightRef = useRef<HTMLDivElement>(null);
  const iceBottomRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setToggled((prev) => !prev);
  };

  const closeMenu = () => setToggled(false);

  /* Animate the ice freeze effect when nav opens/closes */
  useEffect(() => {
    const left = iceLeftRef.current;
    const right = iceRightRef.current;
    const bottom = iceBottomRef.current;
    if (!left || !right || !bottom) return;

    const layers = [left, right, bottom];
    let timers: ReturnType<typeof setTimeout>[] = [];

    function setMask(el: HTMLElement, size: string) {
      el.style.maskSize = size;
      (el.style as unknown as Record<string, string>)["-webkit-mask-size"] = size;
    }

    if (toggled) {
      // Reset all layers
      layers.forEach((el) => {
        el.style.transition = "none";
        el.style.opacity = "0";
      });
      setMask(left, "0% 100%");
      setMask(right, "0% 100%");
      setMask(bottom, "100% 0%");
      void left.offsetHeight;

      // Stage 1 (0s): frost starts creeping from all edges
      layers.forEach((el) => {
        el.style.transition =
          "mask-size 3s linear, -webkit-mask-size 3s linear, opacity 2s ease-out";
      });
      setMask(left, "40% 100%");
      setMask(right, "40% 100%");
      setMask(bottom, "100% 35%");
      layers.forEach((el) => { el.style.opacity = "0.05"; });

      // Stage 2 (2s): growing further
      timers.push(setTimeout(() => {
        layers.forEach((el) => {
          el.style.transition =
            "mask-size 3s linear, -webkit-mask-size 3s linear, opacity 2s ease-out";
        });
        setMask(left, "70% 100%");
        setMask(right, "70% 100%");
        setMask(bottom, "100% 65%");
        layers.forEach((el) => { el.style.opacity = "0.09"; });
      }, 2000));

      // Stage 3 (4s): fully frozen
      timers.push(setTimeout(() => {
        layers.forEach((el) => {
          el.style.transition =
            "mask-size 2.5s ease-out, -webkit-mask-size 2.5s ease-out, opacity 2s ease-out";
        });
        setMask(left, "100% 100%");
        setMask(right, "100% 100%");
        setMask(bottom, "100% 100%");
        layers.forEach((el) => { el.style.opacity = "0.12"; });
      }, 4000));
    } else {
      // Fade out when closing
      layers.forEach((el) => {
        el.style.transition = "opacity 0.8s ease";
        el.style.opacity = "0";
      });
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toggled]);

  return (
    <div className="hamburger-screen">
      {/* Burger button – fixed top-right, always on top */}
      <header className="hamburger-header">
        <button
          type="button"
          className={`target-burger ${toggled ? "toggled" : ""}`}
          onClick={handleToggle}
          aria-expanded={toggled}
          aria-controls="main-nav"
          aria-label={toggled ? "Close menu" : "Open menu"}
        >
          <span className="buns" aria-hidden="true">
            <span className="bun" />
            <span className="bun" />
          </span>
        </button>
      </header>

      <nav
        id="main-nav"
        className={`main-nav ${toggled ? "toggled" : ""}`}
        role="navigation"
        aria-hidden={!toggled}
      >
        {/* Ice freeze overlay — 3 edges creeping inward */}
        <div ref={iceRef} className="nav-ice-overlay" aria-hidden>
          <div ref={iceLeftRef} className="nav-ice-edge nav-ice-left" />
          <div ref={iceRightRef} className="nav-ice-edge nav-ice-right" />
          <div ref={iceBottomRef} className="nav-ice-edge nav-ice-bottom" />
        </div>

        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={label}>
              {href.startsWith("#") ? (
                <a href={href} onClick={closeMenu}>
                  <span>{label}</span>
                </a>
              ) : (
                <Link href={href} onClick={closeMenu}>
                  <span>{label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="hamburger-container">
        {children}
      </div>
    </div>
  );
}
