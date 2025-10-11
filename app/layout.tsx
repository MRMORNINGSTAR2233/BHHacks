import type { Metadata } from "next";
import { Inter, Special_Elite } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Hauntographer",
  description: "An Oracle of Personalized Fear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${specialElite.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
