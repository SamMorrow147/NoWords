"use client";

export default function HalftoneWaves() {
  return (
    <div className="halftone-waves-section" style={{ zIndex: 0 }}>
      <div className="halftone-waves-gradient" />
      <div className="halftone-waves-dots" />
      <div className="halftone-waves-overlay" aria-hidden />
    </div>
  );
}
