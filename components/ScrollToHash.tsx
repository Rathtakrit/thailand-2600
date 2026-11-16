"use client";

import { useEffect } from "react";

/**
 * Scrolls to the part of the page named in the address (for example #s-abc, one solution).
 * The browser's own jump happens before this page's content has arrived, so it misses.
 */
export default function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  return null;
}
