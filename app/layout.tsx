import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourtChat Design System",
  description: "shadcn-based design system for unBail / CourtChat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
