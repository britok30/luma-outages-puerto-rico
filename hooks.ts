import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import Regions from "./pages/api/puerto-rico.json";

export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

export const useMapBox = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYnJpdG9rMzAiLCJhIjoiY2w4ZG1wM3ZiMDB2eTNvbGV2eTBlb2YzdSJ9.FcY2LS-TSORQRUo7iowoDw";

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-66.6);
  const [lat, setLat] = useState(18.2);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://sprites/mapbox/streets-v8",
      center: [lng, lat],
      zoom: zoom,
    });

    // disable map zoom when using scroll
    map.current.scrollZoom.disable();

    map.current.on("load", () => {
      // Add a data source containing GeoJSON data.
      map.current.addSource("puerto-rico", {
        type: "geojson",
        data: Regions,
      });

      // Add a new layer to visualize the polygon.
      map.current.addLayer({
        id: "puerto-rico",
        type: "fill",
        source: "puerto-rico", // reference the data source
        layout: {},
        paint: {
          "fill-color": "#0080ff", // blue color fill
          "fill-opacity": 0.5,
        },
      });

      // Add a black outline around the polygon.
      map.current.addLayer({
        id: "puerto-rico",
        type: "line",
        source: "puerto-rico",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 3,
        },
      });
    });
  });

  return mapContainer;
};
