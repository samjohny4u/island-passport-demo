import type { Metadata, Viewport } from "next";
import { Big_Shoulders_Stencil, Schibsted_Grotesk, Space_Mono } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const display = Big_Shoulders_Stencil({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-display" });
const body = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Island Passport · Bohol",
  description: "Fly to six spots on Bohol, collect a stamp at each and fill your passport.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#173A31",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
