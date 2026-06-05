import type { Metadata } from "next";
import "./globals.css";

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
    url: "https://roshinishomeproducts.com",
    siteName: "Roshini's Home Products",
    images: [
      {
        url: "https://roshinishomeproducts.com/images/og-default.jpg",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
