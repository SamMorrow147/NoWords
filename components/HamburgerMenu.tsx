"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./HamburgerMenu.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

export default function HamburgerMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggled, setToggled] = useState(false);
  const pathname = usePathname();

  // Auto-close the menu whenever the route changes
  useEffect(() => {
    setToggled(false);
  }, [pathname]);

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
        <div className="main-nav-inner">
          <ul>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={label}>
                <a href={href} onClick={closeMenu}>
                  <span>{label}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="tel:6123562684" onClick={closeMenu}>
                <span>Call</span>
              </a>
            </li>
          </ul>
          <div className="nav-social" aria-label="Social links">
            <a
              href="https://www.facebook.com/profile.php?id=61576968374104"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nowords Print Studio on Facebook"
            >
              <img src="/facebook-3.svg" alt="" width={28} height={28} />
            </a>
            <a
              href="https://www.instagram.com/mrnowords_mplstp?igsh=eWs4MXczZThoN2Vr&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nowords Print Studio on Instagram"
            >
              <img src="/instagram-2.svg" alt="" width={28} height={28} />
            </a>
          </div>
        </div>
      </nav>

      <div className="hamburger-container">
        {children}
      </div>
    </div>
  );
}
