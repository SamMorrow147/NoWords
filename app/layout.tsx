import type { Metadata } from "next";
import Script from "next/script";
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

// Image used for link previews (iMessage, Facebook, etc.)
const SHARE_IMAGE_PATH = "/logo_vectorized.png";

// Required for social crawlers: they need a single canonical absolute URL.
// Set NEXT_PUBLIC_SITE_URL in production to your canonical URL (e.g. https://nowordsprintstudio.com).
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://nowordsprintstudio.com";
}

function getShareImageUrl() {
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${SHARE_IMAGE_PATH}`;
}

// Actual dimensions of logo_vectorized.png
const OG_IMAGE_WIDTH = 968;
const OG_IMAGE_HEIGHT = 1074;

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "No Words Print Studio",
  description: "Custom screen printing & embroidery in Minneapolis.",
  icons: {
    icon: "/logo_vectorized.svg",
    apple: "/logo_vectorized.png",
  },
  openGraph: {
    type: "website",
    title: "No Words Print Studio",
    description: "Custom screen printing & embroidery in Minneapolis.",
    images: [
      {
        url: getShareImageUrl(),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Nowords Print Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "No Words Print Studio",
    description: "Custom screen printing & embroidery in Minneapolis.",
    images: [
      {
        url: getShareImageUrl(),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Nowords Print Studio",
      },
    ],
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
        <link rel="stylesheet" href="https://use.typekit.net/bvw8ogk.css" />
        <link rel="preload" href="/CenterFigure.png" as="image" />
        <link rel="preload" href="/logo_vectorized.svg" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kronaOne.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-806KRJKP3G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-806KRJKP3G');
          `}
        </Script>
        <HamburgerMenu>{children}</HamburgerMenu>
      </body>
    </html>
  );
}
