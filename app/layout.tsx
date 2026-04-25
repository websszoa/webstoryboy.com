import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Script from "next/script";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { SheetProvider } from "@/contexts/context-sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_SITE_URL,
  APP_SLOGAN,
  APP_ENG_NAME,
} from "@/lib/constants";

import AuthToast from "@/components/auth/auth-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "900"],
});

const anyvid = localFont({
  variable: "--font-anyvid",
  display: "swap",
  preload: true,
  src: [
    { path: "../public/fonts/anyvid.woff2", weight: "400", style: "normal" },
  ],
});

const nanumSquare = localFont({
  variable: "--font-nanumNeo",
  display: "swap",
  preload: false,
  src: [
    {
      path: "../public/fonts/NanumSquareNeo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const paperlogy = localFont({
  variable: "--font-paperlogy",
  display: "swap",
  preload: true,
  src: [
    {
      path: "../public/fonts/Paperlogy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} | ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  metadataBase: new URL(APP_SITE_URL),
  alternates: { canonical: APP_SITE_URL },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon96.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon96.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon96.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: APP_SITE_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_SITE_URL}/${APP_ENG_NAME}.webp`,
        width: 1200,
        height: 800,
        alt: `${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@imagezoa",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_SITE_URL}/${APP_ENG_NAME}.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${anyvid.variable} ${nanumSquare.variable} ${paperlogy.variable}`}
      >
        <div
          className="splash"
          role="status"
          aria-label="로딩 중"
          aria-live="polite"
        >
          <Image
            src="/icons/favicon.svg"
            alt=""
            width={72}
            height={78}
            priority
            unoptimized
            className="splash__logo"
            style={{ width: "72px", height: "78px" }}
          />
          <span className="splash__name font-paperlogy">{APP_NAME}</span>
          <span className="splash__slogan font-anyvid text-muted-foreground">
            {APP_SLOGAN}
          </span>
        </div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZNL7V3PFLR"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZNL7V3PFLR');
          `}
        </Script>
        <SheetProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                title: "font-anyvid",
                description: "font-anyvid",
              },
            }}
          />
          <Suspense fallback={null}>
            <AuthToast />
          </Suspense>
          <ThemeProvider attribute="class" defaultTheme="light">
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </SheetProvider>
      </body>
    </html>
  );
}
