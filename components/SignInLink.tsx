"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SignInLink({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <Link className="btn ghost" href={`/signin?next=${encodeURIComponent(pathname)}`}>{children}</Link>;
}
