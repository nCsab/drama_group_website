import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import { LanguageProvider } from "@/context/LanguageContext";

const museo300 = localFont({
  src: "../public/fonts/Museo300.otf",
  variable: "--font-museo-300",
  display: "swap",
});

const museo700 = localFont({
  src: "../public/fonts/Museo700.otf",
  variable: "--font-museo-700",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Csalamádé - Diákszínjátszó Tábor",
  description: "Erdély legizgalmasabb diákszínjátszó tábora",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Csalamádé",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${museo300.variable} ${museo700.variable} antialiased`}>
        <LanguageProvider>
          <AnimatedBackground />

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
