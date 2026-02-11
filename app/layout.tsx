import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI UI Generator - Deterministic Component System",
  description: "AI-powered agent that converts natural language to working UI code using a fixed component library",
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
