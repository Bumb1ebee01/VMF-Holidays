"use client";

import { useEffect, useRef } from "react";
import styles from "./RouteMap.module.css";

export interface RoutePoint {
  name: string;
  coords: [number, number];
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Load Leaflet once, from CDN, so there's no build dependency to install.
// Leaflet ships from unpkg, so its types aren't installed — treat `L` as any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletGlobal = any;
function loadLeaflet(): Promise<LeafletGlobal | null> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { L?: LeafletGlobal };
    if (w.L) return resolve(w.L);

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${LEAFLET_JS}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", () => resolve((window as unknown as { L?: LeafletGlobal }).L ?? null));
    script.addEventListener("error", () => reject(new Error("Failed to load Leaflet")));
  });
}

export default function RouteMap({ points }: { points: RoutePoint[] }) {
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    if (!elRef.current || points.length === 0) return;

    loadLeaflet().then((L) => {
      if (cancelled || !L || !elRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(elRef.current, { scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const map = mapRef.current;
      const layer = layerRef.current;
      layer.clearLayers();

      const latlngs = points.map((p) => p.coords);

      points.forEach((p, i) => {
        const marker = L.marker(p.coords, {
          icon: L.divIcon({
            className: styles.pin,
            html: `<span>${i + 1}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
        });
        marker.bindTooltip(p.name, { direction: "top", offset: [0, -12] });
        layer.addLayer(marker);
      });

      if (latlngs.length > 1) {
        layer.addLayer(L.polyline(latlngs, { color: "#FE5C10", weight: 3, dashArray: "6 6" }));
      }

      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
      // The container is often sized after mount — nudge Leaflet to recalc.
      setTimeout(() => map.invalidateSize(), 60);
    });

    return () => {
      cancelled = true;
    };
  }, [points]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (points.length === 0) return null;

  return <div ref={elRef} className={styles.map} role="img" aria-label="Map of your selected places" />;
}
