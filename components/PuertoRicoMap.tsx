"use client";

import { Feature } from "geojson";
import React, { useCallback, useState, useMemo } from "react";
import Map, { Layer, Source } from "react-map-gl";
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

  const updateJSON = (
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>
  ): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
    const { features } = featureCollection;
    return {
      type: "FeatureCollection",
      features: features.map((f, index) => {
        const properties = {
          ...f.properties,
          totalClients: regions[index]?.totalClients || 0,
          totalClientsWithoutService:
            regions[index]?.totalClientsWithoutService || 0,
          percentageClientsWithoutService:
            regions[index]?.percentageClientsWithoutService || 0,
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
    <div className="w-full md:w-2/3 h-[400px] md:h-[600px] mb-20 relative">
      <div className="mb-5 text-center">
        <h2 className="text-2xl md:text-4xl mb-2 text-blue-500">
          Puerto Rico Map - Region Outages
        </h2>
        <p className="text-xs md:text-sm">
          Hover (or tap on mobile) over a region to view statistics.
        </p>
      </div>
      <Map
        initialViewState={{
          longitude: -66.664513,
          latitude: 18.200178,
          zoom: 7.5,
        }}
        scrollZoom={false}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken="pk.eyJ1IjoiYnJpdG9rMzAiLCJhIjoiY201Y3BvY3czMzY3NzJtcHEzMnhhdDNxeCJ9.-nWsweKOMQX3VZ1f-Umxtw"
        onMouseMove={onHover}
        interactiveLayerIds={["fillLayer"]}
      >
        <Source id="puerto-rico" type="geojson" data={data}>
          <Layer
            id="fillLayer"
            type="fill"
            source="puerto-rico"
            paint={{
              "fill-color": "#4BA3C3", // Light blue color to make regions visible and compatible with the ocean color
              "fill-opacity": 0.4, // Lower opacity to show map background
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
          {hoverInfo && <Tooltip hoverInfo={hoverInfo} />}
        </Source>
      </Map>
    </div>
  );
};

const Tooltip = ({ hoverInfo }: { hoverInfo: HoverInfo }) => {
  return (
    <div
      className="absolute bg-white text-gray-800 p-2 rounded-lg shadow-lg text-left"
      style={{
        left: hoverInfo.x,
        top: hoverInfo.y,
        transform: "translate(-50%, -120%)",
        pointerEvents: "none",
      }}
    >
      <h3 className="font-bold text-sm">
        Region: {hoverInfo.feature.properties?.name}
      </h3>
      <ul className="flex flex-col text-xs">
        <li>Total Clients: {hoverInfo.feature.properties?.totalClients}</li>
        <li>
          Without Service:{" "}
          {hoverInfo.feature.properties?.totalClientsWithoutService}
        </li>
        <li>
          Percentage Without Service:{" "}
          {hoverInfo.feature.properties?.percentageClientsWithoutService}%
        </li>
      </ul>
    </div>
  );
};
