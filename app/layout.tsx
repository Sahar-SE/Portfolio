import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuroraCanvas from "@/components/AuroraCanvas";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Sahar Saba Amiri — Software Developer Portfolio",
  description: "Sahar Saba Amiri — Software Developer portfolio showcasing full-stack projects, skills, and experience with a beautiful Next.js animated aurora background.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#09090f", margin: 0 }}>
        {/* Animated Aurora Background */}
        <AuroraCanvas />
        {/* Sticky Header Nav */}
        <Nav />
        {children}
      </body>
    </html>
  );
}
