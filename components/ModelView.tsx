"use client";

import { createElement, useEffect, useState } from "react";

/**
 * A 3D model visitors can rotate. The viewer (Google's model-viewer) is large, so it is only
 * downloaded when a page actually shows a model, and only in the browser.
 */
export default function ModelView({ src, alt, hint, loading }: { src: string; alt: string; hint: string; loading: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    import("@google/model-viewer").then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <figure className="model">
      {ready ? (
        // touch-action "pan-y" keeps the page scrollable with a vertical swipe; a sideways drag rotates the model.
        createElement("model-viewer", { src, alt, "camera-controls": "", "touch-action": "pan-y", "shadow-intensity": "0.6", "interaction-prompt": "none", class: "modelbox" })
      ) : (
        <div className="modelbox muted small" role="status">{loading}</div>
      )}
      <figcaption className="muted small">{hint}</figcaption>
    </figure>
  );
}
