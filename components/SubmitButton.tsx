"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ className, children, disabled = false }: { className?: string; children: ReactNode; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button className={className} type="submit" disabled={disabled || pending} aria-busy={pending}>{children}</button>;
}
