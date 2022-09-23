import { Feature } from "geojson";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import Map, { Layer, Source } from "react-map-gl";
import RegionsJSON from "../pages/api/puerto-rico.json";
import { Regions } from "../types";
import { useDebouncedCallback } from "use-debounce";
import { useWindowSize } from "../hooks";

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
          totalClients: regions[index].totalClients,
          totalClientsWithoutService: regions[index].totalClientsWithoutService,
          percentageClientsWithoutService:
            regions[index].totalClientsWithoutService,
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
      <div className="mb-5">
        <h2 className="text-2xl md:text-4xl mb-2 text-blue-500">
          Puerto Rico Map - Region Outages
        </h2>
        <p className="text-xs md:text-sm">
          Hover (click on mobile) on region to see stats
        </p>
      </div>
      <Map
        initialViewState={{
          longitude: -66.664513,
          latitude: 18.200178,
          zoom: 8,
        }}
        scrollZoom={false}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken="pk.eyJ1IjoiYnJpdG9rMzAiLCJhIjoiY2w4ZG1wM3ZiMDB2eTNvbGV2eTBlb2YzdSJ9.FcY2LS-TSORQRUo7iowoDw"
        onMouseMove={onHover}
        interactiveLayerIds={["fillLayer"]}
      >
        <Source id="puerto-rico" type="geojson" data={data}>
          <Layer
            id="fillLayer"
            type="fill"
            source="puerto-rico"
            paint={{
              "fill-color": {
                property: "totalClientsWithoutService",
                stops: [
                  [150000, "#BA324F"],
                  [170000, "#4BA3C3"],
                  [190000, "#D62839"],
                  [210000, "#175676"],
                ],
              },
              "fill-opacity": 0.6,
            }}
          />
          <Layer
            id="lineLayer"
            type="line"
            source="puerto-rico"
            paint={{
              "line-color": "#000",
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
      className="absolute bg-black top-0 left-[50%] border-white text-white p-2 rounded-lg text-left"
      style={{
        transform: "translate(-50%,10%)",
        backfaceVisibility: "hidden",
      }}
    >
      <div>Region: {hoverInfo.feature.properties?.name}</div>
      <div>Total Clients: {hoverInfo.feature.properties?.totalClients}</div>
      <div>
        Clients Without Service:{" "}
        {hoverInfo.feature.properties?.totalClientsWithoutService}
      </div>
    </div>
  );
};
