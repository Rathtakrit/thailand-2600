"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The top-level sections. A problem page (/p/...) counts as part of Problems. */
export default function NavTabs({ problems, visuals, about, label }: { problems: string; visuals: string; about: string; label: string }) {
  const path = usePathname();
  const onVisuals = path.startsWith("/visuals");
  const onAbout = path.startsWith("/about");
  const onProblems = !onVisuals && !onAbout;
  return (
    <nav className="tabs" aria-label={label}>
      <Link href="/" className={onProblems ? "on" : ""} aria-current={onProblems ? "page" : undefined}>{problems}</Link>
      <Link href="/visuals" className={onVisuals ? "on" : ""} aria-current={onVisuals ? "page" : undefined}>{visuals}</Link>
      <Link href="/about" className={onAbout ? "on" : ""} aria-current={onAbout ? "page" : undefined}>{about}</Link>
    </nav>
  );
}
