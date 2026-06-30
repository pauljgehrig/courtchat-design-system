import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Neue Haas drop-in: when licensed .woff2 files exist in app/fonts/, uncomment:
// import localFont from "next/font/local";
// const neueHaasText = localFont({
//   variable: "--font-neue-haas-text",
//   src: [
//     { path: "./fonts/NeueHaasGroteskText-Regular.woff2", weight: "400" },
//     { path: "./fonts/NeueHaasGroteskText-Medium.woff2", weight: "500" },
//   ],
// });
// const neueHaas = localFont({
//   variable: "--font-neue-haas",
//   src: [
//     { path: "./fonts/NeueHaasGroteskDisplay-Medium.woff2", weight: "600" },
//     { path: "./fonts/NeueHaasGroteskDisplay-Bold.woff2", weight: "700" },
//   ],
// });
// ...then add `neueHaasText.variable` and `neueHaas.variable` to the className below.
// neueHaasText → body (--font-neue-haas-text), neueHaas → headings (--font-neue-haas).

export const metadata: Metadata = {
  title: "CourtChat Design System",
  description: "shadcn-based design system for unBail / CourtChat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background">{children}</body>
    </html>
  );
}
