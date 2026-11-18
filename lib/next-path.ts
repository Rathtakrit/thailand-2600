export function safeNext(next: string): string {
  if (!next.startsWith("/") || /[\u0000-\u001F\u007F\s\\]/.test(next)) return "/";
  try {
    const url = new URL(next, "http://local");
    return url.origin === "http://local" ? url.pathname + url.search : "/";
  } catch {
    return "/";
  }
}
