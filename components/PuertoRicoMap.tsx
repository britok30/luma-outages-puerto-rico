"use client";

import { Feature } from "geojson";
import { useCallback, useState, useMemo } from "react";
import Map, { Layer, Source } from "react-map-gl/mapbox";
import RegionsJSON from "../lib/puerto-rico.json";
import { Regions } from "../lib/types";

interface HoverInfo {
  x: number;
  y: number;
  feature: Feature;
}

export const PuertoRicoMap = ({ regions }: { regions: Regions[] }) => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const onHover = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    if (hoveredFeature) {
      setHoverInfo({ feature: hoveredFeature, x, y });
    } else {
      setHoverInfo(null);
    }
  }, []);

  const REGION_COLORS: Record<string, string> = {
    Arecibo: "#6366f1",   // indigo
    Bayamon: "#f59e0b",   // amber
    Caguas: "#10b981",    // emerald
    Carolina: "#3b82f6",  // blue
    Mayaguez: "#ef4444",  // red
    Ponce: "#8b5cf6",     // violet
    "San Juan": "#ec4899", // pink
  };

  const updateJSON = (
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>
  ): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
    const { features } = featureCollection;
    return {
      type: "FeatureCollection",
      features: features.map((f, index) => {
        const name = regions[index]?.name || f.properties?.name || "";
        const properties = {
          ...f.properties,
          totalClients: regions[index]?.totalClients || 0,
          totalClientsWithoutService:
            regions[index]?.totalClientsWithoutService || 0,
          percentageClientsWithoutService:
            regions[index]?.percentageClientsWithoutService || 0,
          color: REGION_COLORS[name] || "#4BA3C3",
        };
        return { ...f, properties };
      }),
    };
  };

  const data = useMemo(() => {
    return updateJSON(
      RegionsJSON as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );
  }, [regions]);

  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: -66.5901,
          latitude: 18.2208,
          zoom: 7.3,
        }}
        scrollZoom={false}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}
        onMouseMove={onHover}
        interactiveLayerIds={["fillLayer"]}
      >
        <Source id="puerto-rico" type="geojson" data={data}>
          <Layer
            id="fillLayer"
            type="fill"
            source="puerto-rico"
            paint={{
              "fill-color": ["get", "color"],
              "fill-opacity": 0.45,
            }}
          />
          <Layer
            id="lineLayer"
            type="line"
            source="puerto-rico"
            paint={{
              "line-color": "#333",
              "line-width": 1,
            }}
          />
        </Source>
      </Map>
      {hoverInfo && <Tooltip hoverInfo={hoverInfo} />}
    </div>
  );
};

const Tooltip = ({ hoverInfo }: { hoverInfo: HoverInfo }) => {
  return (
    <div
      className="absolute z-10 bg-white text-gray-800 p-2 rounded-lg shadow-lg text-left whitespace-nowrap"
      style={{
        left: hoverInfo.x,
        top: hoverInfo.y,
        transform: "translate(-50%, -120%)",
        pointerEvents: "none",
      }}
    >
      <h3 className="font-bold text-sm">
        Region | Región: {hoverInfo.feature.properties?.name}
      </h3>
      <ul className="flex flex-col text-xs">
        <li>Total Clients | Clientes Totales: {hoverInfo.feature.properties?.totalClients}</li>
        <li>
          Without Service | Sin Servicio:{" "}
          {hoverInfo.feature.properties?.totalClientsWithoutService}
        </li>
        <li>
          Percentage Without Service | Porcentaje Sin Servicio:{" "}
          {hoverInfo.feature.properties?.percentageClientsWithoutService}%
        </li>
      </ul>
    </div>
  );
};
