import type { Metadata } from "next";
import { Geist, Geist_Mono, Krona_One } from "next/font/google";
import HamburgerMenu from "@/components/HamburgerMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kronaOne = Krona_One({
  variable: "--font-krona",
  weight: "400",
  subsets: ["latin"],
});

// Image used for link previews (iMessage, Facebook, etc.) — metal section background (earrings / woman)
const SHARE_IMAGE = "/freepik__a-product-shot-of-earrings-on-a-beautiful-ethnic-w__60530.png";

// Required for social crawlers to resolve the share image to an absolute URL
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://shopcoldculture.com"; // fallback for production
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Cold Culture",
  description: "High-end lifestyle brand",
  openGraph: {
    title: "Cold Culture",
    description: "High-end lifestyle brand",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Culture",
    description: "High-end lifestyle brand",
    images: [SHARE_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/Heroimage.png" as="image" />
        <link rel="preload" href="/CenterFigure.png" as="image" />
        <link rel="preload" href="/ColdCulture.svg" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kronaOne.variable} antialiased`}
      >
        <HamburgerMenu>{children}</HamburgerMenu>
      </body>
    </html>
  );
}
