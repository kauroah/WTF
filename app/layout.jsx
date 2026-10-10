import { Suspense } from "react";

import "@/index.css";

import Providers from "@/components/NextProviders";

export const metadata = {
  title: "WHAT THE FASHION — люди для fashion-работы",
  description: "WHAT THE FASHION помогает fashion-профессионалам находить фотографов, моделей, стилистов, визажистов и дизайнеров для творческой работы.",
  openGraph: {
    title: "WHAT THE FASHION",
    description: "Найдите людей для съёмки, показа и кампании. Портфолио, города, направления.",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: { icon: "/logo-engine.svg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}