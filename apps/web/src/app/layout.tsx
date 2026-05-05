import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/**
 * Plus Jakarta Sans — closest publicly available match to Blinkit's Gilroy font.
 * Gilroy is a commercial font; Plus Jakarta Sans shares the same geometric,
 * rounded, modern proportions across all weights.
 */
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blinkit Clone — Frequently Bought Together",
  description:
    "A minimal Blinkit-style web app showcasing a Frequently Bought Together recommendation system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} min-h-full flex flex-col bg-[#F4F6F9] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
