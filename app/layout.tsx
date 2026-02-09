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
const SHARE_IMAGE_PATH =
  "/freepik__dramatic-close-up-of-her-shirt-in-a-winter-storm__35141.png";

// Required for social crawlers: they need a single canonical absolute URL.
// Set NEXT_PUBLIC_SITE_URL in production to your canonical URL (e.g. https://shopcoldculture.com).
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://shopcoldculture.com";
}

function getShareImageUrl() {
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${SHARE_IMAGE_PATH}`;
}

// Recommended OG size for reliable previews (Facebook, iMessage, etc.)
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Cold Culture",
  description: "High-end lifestyle brand",
  icons: {
    icon: "/Favacon.png",
  },
  openGraph: {
    type: "website",
    title: "Cold Culture",
    description: "High-end lifestyle brand",
    images: [
      {
        url: getShareImageUrl(),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Cold Culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Culture",
    description: "High-end lifestyle brand",
    images: [
      {
        url: getShareImageUrl(),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Cold Culture",
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
        <link rel="preload" href="/Heroimage.png" as="image" />
        <link rel="preload" href="/CenterFigure.png" as="image" />
        <link rel="preload" href="/ColdCulture.svg" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kronaOne.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B7XW7YNMB5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B7XW7YNMB5');
          `}
        </Script>
        <HamburgerMenu>{children}</HamburgerMenu>
      </body>
    </html>
  );
}
