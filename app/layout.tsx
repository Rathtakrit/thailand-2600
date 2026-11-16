import type { Metadata } from "next";
import { Anuphan, Chakra_Petch } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/Header";
import "./globals.css";

const body = Anuphan({ variable: "--font-body", subsets: ["latin", "thai"], weight: ["400", "500", "600"] });
const display = Chakra_Petch({ variable: "--font-display", subsets: ["latin", "thai"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Thailand 2600",
  description: "Name a problem in Thailand, pitch the solution you believe would solve it by B.E. 2600, and have it judged in the open.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${body.variable} ${display.variable}`}>
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
