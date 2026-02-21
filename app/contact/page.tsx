"use client";

export default function ContactPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-4 pt-24 pb-16"
      style={{ background: "#0a0a0a" }}
    >
      {/* Logo — top left, absolute, non-intrusive */}
      <a
        href="/"
        aria-label="Back to home"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 30,
          display: "block",
          width: "min(70vw, 7.5rem)",
          padding: "0.75rem",
          pointerEvents: "auto",
        }}
      >
        <img
          src="/logo_vectorized.svg"
          alt="No Words Print Studio"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            filter:
              "drop-shadow(0 0 6px rgba(65,105,225,0.95)) " +
              "drop-shadow(0 0 15px rgba(65,105,225,0.8)) " +
              "drop-shadow(0 0 35px rgba(65,105,225,0.6)) " +
              "drop-shadow(0 0 70px rgba(65,105,225,0.35)) " +
              "drop-shadow(0 0 120px rgba(65,105,225,0.2))",
          }}
        />
      </a>

      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-10">
        <h1
          style={{
            fontFamily: "'Abject Failure', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(3rem, 12vw, 5.5rem)",
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          Get in Touch
        </h1>
        <p
          className="mt-4 text-white/70"
          style={{
            fontFamily: '"pressio-stencil-cond", sans-serif',
            fontSize: "clamp(1rem, 3.5vw, 1.35rem)",
          }}
        >
          Ready to put an order in? Fill out the form below and we&apos;ll get back to you.
        </p>
      </div>

      {/* JotForm iframe embed */}
      <div className="w-full max-w-2xl">
        <iframe
          id="JotFormIFrame-260516248331048"
          title="Contact Form"
          src="https://form.jotform.com/260516248331048"
          style={{
            width: "100%",
            minHeight: "1400px",
            border: "none",
            borderRadius: "8px",
          }}
          scrolling="no"
          allowFullScreen
        />
      </div>
    </div>
  );
}
