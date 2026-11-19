"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Area } from "@/lib/types";

const KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const STYLE = KEY
  ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${KEY}`
  : "https://tiles.openfreemap.org/styles/positron";

/** Lucknow map with one bubble per area, sized by how many food spots it has. */
export function AreaMap({ areas, height = 420 }: { areas: Area[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    (async () => {
      const maplibre = (await import("maplibre-gl")).default;
      if (cancelled || !ref.current) return;

      map = new maplibre.Map({
        container: ref.current,
        style: STYLE,
        center: [80.9462, 26.8467],
        zoom: 11.2,
        maxBounds: [
          [80.75, 26.68],
          [81.15, 27.02],
        ],
        attributionControl: { compact: true },
      });
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");

      const features = areas
        .filter((a) => a.lat !== null && a.lng !== null)
        .map((a) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [a.lng as number, a.lat as number] },
          properties: { slug: a.slug, name: a.name, count: a.vendor_count },
        }));

      map.on("load", () => {
        if (!map) return;
        map.addSource("areas", { type: "geojson", data: { type: "FeatureCollection", features } });
        map.addLayer({
          id: "area-bubbles",
          type: "circle",
          source: "areas",
          paint: {
            "circle-color": "#DCC6A0",
            "circle-opacity": 0.85,
            "circle-stroke-color": "#7A5A36",
            "circle-stroke-width": 1.5,
            "circle-radius": ["interpolate", ["linear"], ["get", "count"], 1, 8, 20, 16, 80, 30],
          },
        });
        map.addLayer({
          id: "area-labels",
          type: "symbol",
          source: "areas",
          layout: {
            "text-field": ["get", "count"],
            "text-size": 12,
            "text-allow-overlap": true,
          },
          paint: { "text-color": "#14110E" },
        });

        map.on("mouseenter", "area-bubbles", () => {
          if (map) map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "area-bubbles", () => {
          if (map) map.getCanvas().style.cursor = "";
        });
        map.on("click", "area-bubbles", (e) => {
          const f = e.features?.[0];
          if (!f || !map) return;
          const { slug, name, count } = f.properties as { slug: string; name: string; count: number };
          const esc = (s: string) =>
            String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
          const html = `<strong>${esc(name)}</strong><br/>${Number(count)} food spots<br/><a href="/area/${encodeURIComponent(slug)}" style="color:#DCC6A0;text-decoration:underline">See the list</a>`;
          new maplibre.Popup({ closeButton: false })
            .setLngLat((f.geometry as unknown as { coordinates: [number, number] }).coordinates)
            .setHTML(html)
            .addTo(map);
        });
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [areas]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Map of Lucknow areas with food spot counts"
      className="w-full overflow-hidden rounded-2xl border border-line"
      style={{ height }}
    />
  );
}
