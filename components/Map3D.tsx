"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GRID, PROVINCES } from "@/lib/provinces";

type Props = {
  /** Problems named per region key. */
  counts: Record<string, number>;
  /** The region the list is filtered to, if any. */
  selected?: string;
  thai: boolean;
  /** Region key to its display name and to the link that filters the list to it. */
  regionNames: Record<string, string>;
  hrefs: Record<string, string>;
  labels: { hint: string; show: string; aria: string };
  /** Shown until the 3D map is ready, and kept if this device cannot draw 3D. */
  children: React.ReactNode;
};

type Live = { apply: (counts: Record<string, number>, selected: string | undefined, picked: number | null) => void; dispose: () => void };

/**
 * Thailand as 77 six-sided tiles you can turn by dragging. Tiles are coloured by region and stand taller
 * where problems have been named; the region the list is filtered to rises well above the rest.
 * Tapping a tile shows the province's name and a link to its region.
 * The 3D code (three) is only downloaded here, in the browser, on the page that shows the map.
 */
export default function Map3D({ counts, selected, thai, regionNames, hrefs, labels, children }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const live = useRef<Live | null>(null);
  const [ready, setReady] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  // The newest props, readable from inside the 3D code without rebuilding it.
  const latest = useRef({ counts, selected, picked });
  useEffect(() => {
    latest.current = { counts, selected, picked };
    live.current?.apply(counts, selected, picked);
  }, [counts, selected, picked, ready]);

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // No 3D on this device: the flat map underneath stays.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const canvas = renderer.domElement;
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x8c7a6b, 1.5));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.position.set(-6, 12, 8);
      scene.add(sun);

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
      // Honeycomb: six-sided tiles, every second row shifted half a tile so they nest.
      const R = 0.58, stepX = Math.sqrt(3) * R, stepZ = 1.5 * R;
      const spanX = (GRID.cols - 0.5) * stepX, spanZ = (GRID.rows - 1) * stepZ;
      const reach = Math.hypot(spanX, spanZ) / 2 + 0.8; // radius of the whole map

      const css = getComputedStyle(host);
      const colourOf = (region: string) => new THREE.Color(css.getPropertyValue(`--rg-${region}`).trim() || "#cccccc");

      const geometry = new THREE.CylinderGeometry(R * 0.94, R * 0.94, 1, 6);
      const blocks = PROVINCES.map((prov, i) => {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 }));
        mesh.position.set((prov.col + (prov.row % 2) * 0.5) * stepX - spanX / 2, 0, prov.row * stepZ - spanZ / 2);
        mesh.userData.height = 0.35;
        mesh.userData.index = i;
        scene.add(mesh);
        return mesh;
      });

      const apply: Live["apply"] = (c, sel, pick) => {
        blocks.forEach((mesh, i) => {
          const prov = PROVINCES[i];
          const n = c[prov.region] ?? 0;
          // "all" is the Nationwide filter: every province belongs to it.
          const isPicked = pick === i, inSelected = sel === prov.region || sel === "all";
          const filtering = !!sel;
          // The filtered region stands up clearly; the tick below eases each tile to this height.
          mesh.userData.height = 0.35 + Math.min(n, 4) * 0.18 + (inSelected ? 1.3 : 0) + (isPicked ? 0.6 : 0);
          const base = colourOf(prov.region);
          // While a filter is on, everything outside it fades back. Otherwise regions with no problems are paler.
          if (filtering && !inSelected && !isPicked) base.lerp(colourOf("none"), 0.75);
          else if (!filtering && n === 0 && !isPicked) base.lerp(colourOf("none"), 0.5);
          mesh.material.color.copy(base);
          mesh.material.emissive.copy(base).multiplyScalar(isPicked ? 0.45 : inSelected ? 0.25 : 0);
        });
      };

      const controls = new OrbitControls(camera, canvas);
      controls.target.set(0, 0.6, 0);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableDamping = true;
      // Start looking from the south and a little above, so the shape reads as Thailand with north at the top.
      camera.position.setFromSphericalCoords(10, Math.PI * 0.23, -0.3).add(controls.target);
      controls.minPolarAngle = Math.PI * 0.1;
      controls.maxPolarAngle = Math.PI * 0.4;
      controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.autoRotateSpeed = 0.6;
      // A sideways drag turns the map; an up-or-down swipe still scrolls the page on a phone.
      canvas.style.touchAction = "pan-y";

      const fit = () => {
        const w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const vertical = THREE.MathUtils.degToRad(camera.fov) / 2;
        const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
        // 0.8: the map is long and thin, so it may sit a little closer than a full sphere would need.
        const distance = (reach * 0.8) / Math.sin(Math.min(vertical, horizontal));
        const dir = camera.position.clone().sub(controls.target);
        camera.position.copy(controls.target).add(dir.setLength(distance));
        camera.updateProjectionMatrix();
      };
      fit();
      const resize = new ResizeObserver(fit);
      resize.observe(host);

      // Tap (not drag) picks a province.
      const ray = new THREE.Raycaster();
      let downAt: [number, number] | null = null;
      const onDown = (e: PointerEvent) => {
        downAt = [e.clientX, e.clientY];
        controls.autoRotate = false;
      };
      const onUp = (e: PointerEvent) => {
        if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
        const r = canvas.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        const hit = ray.intersectObjects(blocks)[0];
        setPicked(hit ? (hit.object.userData.index as number) : null);
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointerup", onUp);

      // Only draw while the map is on screen.
      let visible = true, frame = 0;
      const watch = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      watch.observe(host);
      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible) return;
        controls.update();
        for (const mesh of blocks) {
          const h = mesh.scale.y + (mesh.userData.height - mesh.scale.y) * 0.18;
          mesh.scale.y = h;
          mesh.position.y = h / 2;
        }
        renderer.render(scene, camera);
      };
      tick();

      // Day and night have different block colours.
      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const recolour = () => live.current?.apply(latest.current.counts, latest.current.selected, latest.current.picked);
      scheme.addEventListener("change", recolour);

      live.current = { apply, dispose: () => {} };
      recolour();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        scheme.removeEventListener("change", recolour);
        watch.disconnect();
        resize.disconnect();
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointerup", onUp);
        controls.dispose();
        geometry.dispose();
        blocks.forEach((m) => m.material.dispose());
        renderer.dispose();
        canvas.remove();
        live.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const prov = picked === null ? null : PROVINCES[picked];
  return (
    <div className="map3dwrap">
      <div className="map3d" ref={box} role="img" aria-label={labels.aria}>
        {ready ? null : children}
      </div>
      <p className="mapnote small" aria-live="polite">
        {prov ? (
          <>
            <b>{thai ? prov.th : prov.en}</b> · {regionNames[prov.region]} · <Link href={hrefs[prov.region]} scroll={false}>{labels.show} {regionNames[prov.region]}</Link>
          </>
        ) : (
          <span className="muted">{labels.hint}</span>
        )}
      </p>
    </div>
  );
}
