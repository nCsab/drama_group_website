import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
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

export const metadata: Metadata = {
  title: "Csalamádé - Diákszínjátszó Tábor",
  description: "Erdély legizgalmasabb diákszínjátszó tábora",
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
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: "linear-gradient(135deg, #4a4d3a, #757960, #9ca082, #757960, #4a4d3a)",
              zIndex: 0,
              pointerEvents: "none"
            }}
          />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
