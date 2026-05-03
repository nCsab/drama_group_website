import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import QueryProvider from "@/components/QueryProvider";

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
  themeColor: "transparent",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
        <QueryProvider>
          <LanguageProvider>
            <main>{children}</main>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
