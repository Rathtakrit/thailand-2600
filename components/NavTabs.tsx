"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The two top-level sections. A problem page (/p/...) counts as part of Problems. */
export default function NavTabs({ problems, visuals }: { problems: string; visuals: string }) {
  const path = usePathname();
  const onVisuals = path.startsWith("/visuals");
  return (
    <nav className="tabs" aria-label="Sections">
      <Link href="/" className={onVisuals ? "" : "on"} aria-current={onVisuals ? undefined : "page"}>{problems}</Link>
      <Link href="/visuals" className={onVisuals ? "on" : ""} aria-current={onVisuals ? "page" : undefined}>{visuals}</Link>
    </nav>
  );
}
