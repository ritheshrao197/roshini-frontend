import type { Metadata } from "next";
import Script from "next/script";
import { MotionConfig } from "motion/react";
import "./globals.css";
import HeaderWrapper from "@/components/partials/HeaderWrapper";
import VersionBadge from "@/components/partials/VersionBadge";
import { CustomizationProvider } from "@/lib/CustomizationContext";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeManager } from "@/lib/ThemeProvider";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: {
    template: "%s | Roshini's Home Products",
    default: "Roshini's Home Products — Traditional Nutrition for Modern Families",
  },
  description:
    "Authentic homemade health mixes, seed mixes, herbal teas, spice powders and nutrition products from Karnataka. Preservative-free, no added sugar, handcrafted in small batches.",
  keywords: [
    "health mixes",
    "homemade nutrition",
    "Karnataka traditional food",
    "seed mixes",
    "herbal tea",
    "spice powder",
    "preservative free",
    "Roshini Home Products",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://roshinis.com",
    siteName: "Roshini's Home Products",
    images: [
      {
        url: "https://roshinis.com/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Roshini's Home Products — Traditional Nutrition",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout = _document.js equivalent in App Router */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap"
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

        {/* Sentry Integration */}
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <Script
            id="sentry-sdk"
            src="https://browser.sentry-cdn.com/7.60.0/bundle.min.js"
            strategy="afterInteractive"
            onLoad={() => {
              // @ts-ignore
              if (window.Sentry) {
                // @ts-ignore
                window.Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
              }
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <ThemeManager />
            <CustomizationProvider>
              {/*
                Motion's own default is `reducedMotion: "never"` — it does NOT read
                prefers-reduced-motion unless told to. "user" makes every Motion-driven
                animation below this point (transform/opacity tweens) resolve instantly
                to its final state when the OS/browser requests reduced motion, which is
                why individual components don't each need their own gate. Site-wide on
                purpose: it covers future animations as well as today's.
              */}
              <MotionConfig reducedMotion="user">
                <HeaderWrapper />
                {children}
                <VersionBadge />
              </MotionConfig>
            </CustomizationProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
