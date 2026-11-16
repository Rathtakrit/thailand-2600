import type { Metadata } from "next";
import { Poppins, Prompt } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/Header";
import "./globals.css";

// Poppins is round and easy to read but has no Thai letters; Prompt is its Thai partner and fills them in.
const latin = Poppins({ variable: "--font-latin", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const thai = Prompt({ variable: "--font-thai", subsets: ["thai"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Thailand 2600",
  description: "Name a problem in Thailand, pitch the solution you believe would solve it by B.E. 2600, and have it judged in the open.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${latin.variable} ${thai.variable}`}>
      <body>
        <Suspense fallback={<header className="top"><div className="wrap topin"><span className="brand">THAILAND <b>2600</b></span></div></header>}>
          <Header />
        </Suspense>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
