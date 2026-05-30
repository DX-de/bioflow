import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
  },
  title: {
    default: `${APP_NAME} — Votre bio link en un clic`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Créez votre page de liens personnalisée. Partagez Instagram, TikTok, YouTube et plus sur une seule URL.",
  keywords: ["bio link", "link in bio", "réseaux sociaux", "créateur"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
