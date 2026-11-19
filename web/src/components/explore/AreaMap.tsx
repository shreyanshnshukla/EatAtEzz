"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import type { Area } from "@/lib/domain";
import { env } from "@/lib/env";

const STYLE = env.maptilerKey
  ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${env.maptilerKey}`
  : "https://tiles.openfreemap.org/styles/fiord";
const LUCKNOW: [number, number] = [80.9462, 26.8467];
const BOUNDS: [[number, number], [number, number]] = [[80.75, 26.68], [81.15, 27.02]];

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Lucknow map with one bubble per area, sized by how many food spots it has. */
export function AreaMap({ areas, height = 420 }: { areas: Area[]; height?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    import("maplibre-gl").then(({ default: maplibre }) => {
      if (cancelled || !container.current) return;
      map = new maplibre.Map({ container: container.current, style: STYLE, center: LUCKNOW, zoom: 11.2, maxBounds: BOUNDS, attributionControl: { compact: true } });
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");

      const features = areas.flatMap((a) =>
        a.lat === null || a.lng === null
          ? []
          : [{ type: "Feature" as const, geometry: { type: "Point" as const, coordinates: [a.lng, a.lat] }, properties: { slug: a.slug, name: a.name, count: a.vendorCount } }],
      );

      map.on("load", () => {
        if (!map) return;
        map.addSource("areas", { type: "geojson", data: { type: "FeatureCollection", features } });
        map.addLayer({
          id: "area-bubbles",
          type: "circle",
          source: "areas",
          paint: {
            "circle-color": "#7A5A36",
            "circle-opacity": 0.9,
            "circle-stroke-color": "#DCC6A0",
            "circle-stroke-width": 1.5,
            "circle-radius": ["interpolate", ["linear"], ["get", "count"], 1, 8, 20, 16, 80, 30],
          },
        });
        map.addLayer({
          id: "area-labels",
          type: "symbol",
          source: "areas",
          layout: { "text-field": ["get", "count"], "text-size": 12, "text-allow-overlap": true },
          paint: { "text-color": "#F6EEDC" },
        });
        map.on("mouseenter", "area-bubbles", () => map && (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "area-bubbles", () => map && (map.getCanvas().style.cursor = ""));
        map.on("click", "area-bubbles", (e) => {
          const f = e.features?.[0];
          if (!f || !map || f.geometry.type !== "Point") return;
          const { slug, name, count } = f.properties as { slug: string; name: string; count: number };
          new maplibre.Popup({ closeButton: false })
            .setLngLat(f.geometry.coordinates as [number, number])
            .setHTML(
              `<strong>${escapeHtml(name)}</strong><br/>${Number(count)} food spots<br/><a href="/area/${encodeURIComponent(slug)}" style="color:#DCC6A0;text-decoration:underline">See the list</a>`,
            )
            .addTo(map);
        });
      });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [areas]);

  return (
    <div ref={container} role="region" aria-label="Map of Lucknow areas with food spot counts" className="w-full overflow-hidden rounded-2xl border border-line" style={{ height }} />
  );
}
