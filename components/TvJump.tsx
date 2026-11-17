"use client";

import { useEffect } from "react";

/**
 * Makes a click on the TV zoom into the screen before moving down to the problems.
 * Without this (or with reduced motion) the TV is still a plain link that jumps there.
 */
export default function TvJump() {
  useEffect(() => {
    const room = document.querySelector<SVGElement>(".intro .room");
    const target = document.getElementById("problems");
    if (!room || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const go = (e: Event) => {
      if (!(e.target as Element).closest(".rm-tvlink")) return;
      e.preventDefault();
      room.classList.add("zoom");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        room.classList.remove("zoom");
      }, 750);
    };
    const intro = room.closest(".intro")!;
    intro.addEventListener("click", go);
    return () => {
      window.clearTimeout(timer);
      intro.removeEventListener("click", go);
    };
  }, []);
  return null;
}
