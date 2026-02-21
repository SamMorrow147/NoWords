"use client";

import Link from "next/link";

export default function MaskButton({
  href,
  label = "Contact",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`mask-btn-container ${className}`} aria-label={label}>
      <span className="mask-btn-label">{label}</span>
      <span className="mask-btn-fill">{label}</span>
    </Link>
  );
}
