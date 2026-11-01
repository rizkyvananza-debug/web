import type { Metadata } from "next";
import "./globals.css";
import WelcomeModal from "../components/WelcomeModal";

export const metadata: Metadata = {
  title: "No More Eurydice — A Gothic Romance Archive",
  description: "An unofficial fan-made tribute to No More Eurydice. Explore the story, characters, and chapter guide.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}<WelcomeModal /></body></html>;
}
