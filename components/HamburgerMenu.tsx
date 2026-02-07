"use client";

import { useState } from "react";
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

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setToggled((prev) => !prev);
  };

  const closeMenu = () => setToggled(false);

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
