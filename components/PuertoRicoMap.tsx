"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { MapLayerMouseEvent } from "mapbox-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapGL, { Layer, NavigationControl, Source, type MapRef } from "react-map-gl/mapbox";
import RegionsJSON from "@/lib/puerto-rico.json";
import { Regions } from "@/lib/types";
import { useLang, formatNumber } from "@/lib/i18n";
import { severityHex as severityColor } from "./RegionLedger";

interface HoverInfo {
  x: number;
  y: number;
  feature: Feature;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

/** Puerto Rico incl. Vieques and Culebra, with a little breathing room. */
const PR_BOUNDS: [[number, number], [number, number]] = [
  [-67.4, 17.85],
  [-65.15, 18.6],
];

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

const SEVERITY_STEPS: Array<[number, string]> = [
  [0, severityColor(0)],
  [1, severityColor(1)],
  [5, severityColor(5)],
  [20, severityColor(20)],
  [50, severityColor(50)],
];

export const PuertoRicoMap = ({ regions }: { regions: Regions[] }) => {
  const { t } = useLang();
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const mapRef = useRef<MapRef>(null);

  // The map mounts (lazily) inside an absolutely-positioned grid cell and can
  // capture a stale container size, leaving tiles to render in a small square
  // and `load` never firing. Re-measure a few times after mount and whenever
  // the style (re)loads.
  const resize = useCallback(() => mapRef.current?.resize(), []);
  useEffect(() => {
    const timers = [100, 500, 1500, 3000].map((ms) => setTimeout(resize, ms));
    return () => timers.forEach(clearTimeout);
  }, [resize]);

  const data = useMemo<FeatureCollection<Geometry>>(() => {
    const byName = new Map(regions.map((r) => [normalize(r.name), r]));
    const base = RegionsJSON as FeatureCollection<Geometry>;
    return {
      type: "FeatureCollection",
      features: base.features.map((f) => {
        const name: string = f.properties?.name ?? "";
        const region = byName.get(normalize(name));
        const pct = region?.percentageClientsWithoutService ?? 0;
        return {
          ...f,
          id: f.properties?.id,
          properties: {
            ...f.properties,
            name: region?.name ?? name,
            hasData: !!region,
            totalClients: region?.totalClients ?? 0,
            totalClientsWithoutService: region?.totalClientsWithoutService ?? 0,
            pct,
          },
        };
      }),
    };
  }, [regions]);

  const onMove = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature) {
      setHoverInfo({ feature, x: event.point.x, y: event.point.y });
    } else {
      setHoverInfo(null);
    }
  }, []);

  const onLeave = useCallback(() => setHoverInfo(null), []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-moss-2 p-6 text-center">
        {t(
          "El mapa no está disponible (falta la clave de Mapbox).",
          "Map unavailable (Mapbox token not configured)."
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapGL
        ref={mapRef}
        initialViewState={{
          bounds: PR_BOUNDS,
          fitBoundsOptions: { padding: 24 },
        }}
        scrollZoom={false}
        touchPitch={false}
        dragRotate={false}
        mapStyle="mapbox://styles/mapbox/standard"
        config={{
          basemap: {
            theme: "monochrome",
            lightPreset: "day",
            showPointOfInterestLabels: false,
            showTransitLabels: false,
            showRoadLabels: false,
            show3dObjects: false,
          },
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={resize}
        onStyleData={resize}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onMove}
        interactiveLayerIds={["fillLayer"]}
        cursor={hoverInfo ? "pointer" : "grab"}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="puerto-rico" type="geojson" data={data}>
          <Layer
            id="fillLayer"
            type="fill"
            slot="middle"
            paint={{
              "fill-color": [
                "step",
                ["get", "pct"],
                SEVERITY_STEPS[0][1],
                SEVERITY_STEPS[1][0],
                SEVERITY_STEPS[1][1],
                SEVERITY_STEPS[2][0],
                SEVERITY_STEPS[2][1],
                SEVERITY_STEPS[3][0],
                SEVERITY_STEPS[3][1],
                SEVERITY_STEPS[4][0],
                SEVERITY_STEPS[4][1],
              ],
              "fill-opacity": 0.75,
            }}
          />
          <Layer
            id="lineLayer"
            type="line"
            slot="middle"
            paint={{ "line-color": "#0a1a3f", "line-width": 0.8 }}
          />
        </Source>
      </MapGL>

      {hoverInfo && <Tooltip hoverInfo={hoverInfo} />}

      <Legend />
    </div>
  );
};

const Legend = () => {
  const { t } = useLang();
  const labels = ["<1%", "1–5%", "5–20%", "20–50%", "≥50%"];
  return (
    <div
      aria-label={t("Leyenda", "Legend")}
      className="absolute left-4 bottom-4 z-10 bg-cream/90 backdrop-blur-sm border border-cream-3 px-3 py-2.5 text-[11px] text-moss"
    >
      <p className="eyebrow text-ink mb-2">
        {t("Sin servicio", "Without service")}
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {SEVERITY_STEPS.map(([, color], i) => (
          <li key={color} className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {labels[i]}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Tooltip = ({ hoverInfo }: { hoverInfo: HoverInfo }) => {
  const { t } = useLang();
  const p = hoverInfo.feature.properties ?? {};
  const pct = Number(p.pct ?? 0);

  return (
    <div
      role="tooltip"
      className="absolute z-10 bg-ink text-cream px-3.5 py-2.5 text-left whitespace-nowrap shadow-[0_10px_30px_rgba(10,26,63,0.35)]"
      style={{
        left: hoverInfo.x,
        top: hoverInfo.y,
        transform: "translate(-50%, -115%)",
        pointerEvents: "none",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block w-2 h-2"
          style={{ backgroundColor: severityColor(pct) }}
          aria-hidden
        />
        <h3 className="font-semibold text-sm">{p.name}</h3>
      </div>
      {p.hasData ? (
        <ul className="text-xs space-y-0.5 tabular-nums">
          <li>
            <span className="text-moss-2">{t("Sin servicio", "Without service")}:</span>{" "}
            <span className="font-semibold">{formatNumber(p.totalClientsWithoutService)}</span>{" "}
            ({pct.toFixed(1)}%)
          </li>
          <li>
            <span className="text-moss-2">{t("Clientes totales", "Total customers")}:</span>{" "}
            {formatNumber(p.totalClients)}
          </li>
        </ul>
      ) : (
        <p className="text-xs text-moss">{t("Sin datos", "No data")}</p>
      )}
    </div>
  );
};
