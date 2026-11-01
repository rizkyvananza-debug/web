
import type { Metadata } from "next";
import "./globals.css";
import WelcomeModal from "../components/WelcomeModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://andrewstoreyaoi.biz.id"),

  title: {
    default: "Andrew Store Yaoi | No More Eurydice",
    template: "%s | Andrew Store Yaoi",
  },

  description:
    "Andrew Store Yaoi menyediakan layanan sewa No More Eurydice Bot, Jae Bot, dan User Premium. Temukan informasi layanan, harga, dan kontak owner Andrew & Luke.",

  keywords: [
    "Andrew Store Yaoi",
    "Andrew Store",
    "No More Eurydice",
    "No More Eurydice Bot",
    "Jae Bot",
    "sewa bot WhatsApp",
    "User Premium",
    "Andrew dan Luke",
  ],

  openGraph: {
    title: "Andrew Store Yaoi | No More Eurydice",
    description:
      "Layanan sewa bot WhatsApp dan User Premium dari Andrew & Luke.",
    url: "https://andrewstoreyaoi.biz.id",
    siteName: "Andrew Store Yaoi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        {children}
        <WelcomeModal />
      </body>
    </html>
  );
}
