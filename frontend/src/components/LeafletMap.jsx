/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// (Optional but useful) Fix default marker icons when bundling with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// NOTE: geocoding (Nominatim) logic has been removed from this file.
// If you need address -> coords conversion, perform geocoding elsewhere
// and pass coordinate objects ({ lat, lon }) into the helpers exposed by onReady.

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LeafletMap({
  center = [23.0225, 72.5714],
  zoom = 12,
  onReady,
}) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);

  // route + markers
  const routeLayerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  // NEW: separate refs for route endpoints (don't reuse pickup/dest refs)
  const routeStartMarkerRef = useRef(null);
  const routeEndMarkerRef = useRef(null);

  // Request controller for routing (so we can cancel calls)
  const routeReqControllerRef = useRef(null);

  // live movement
  const liveAnimRef = useRef(null); // { reqId, lastTs, distanceTraveled, totalDistance, speed, marker, data... }

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map(mapEl.current, { zoomControl: false }).setView(
      center,
      zoom
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    /* ----- safe helpers ----- */

    function ensureMapInvalidate(map, timeout = 80) {
      if (!map) return;
      if (ensureMapInvalidate._timer) clearTimeout(ensureMapInvalidate._timer);
      ensureMapInvalidate._timer = setTimeout(() => {
        try {
          if (typeof map.invalidateSize === "function") map.invalidateSize();
        } catch (err) {
          if (typeof console !== "undefined" && console.debug) {
            console.debug("ensureMapInvalidate failed:", err);
          }
        } finally {
          ensureMapInvalidate._timer = null;
        }
      }, timeout);
    }

    function safeRemoveLayer(map, layerRef) {
      if (!map || !layerRef || !layerRef.current) return;
      try {
        map.removeLayer(layerRef.current);
      } catch (err) {
        if (typeof console !== "undefined" && console.debug) {
          console.debug("safeRemoveLayer failed:", err);
        }
      } finally {
        layerRef.current = null;
      }
    }

    /* ----- drawRoute ----- */

    function drawRoute(geojsonLineString) {
      const map = mapRef.current;
      if (!map) {
        console.warn("drawRoute: map not ready");
        return;
      }
      if (!geojsonLineString) {
        console.warn("drawRoute: no geometry provided");
        return;
      }

      // Normalize geometry: accept Feature, geometry, or raw coordinates array
      let geometry = null;
      if (Array.isArray(geojsonLineString)) {
        geometry = { type: "LineString", coordinates: geojsonLineString };
      } else if (
        geojsonLineString &&
        geojsonLineString.type === "Feature" &&
        geojsonLineString.geometry
      ) {
        geometry = geojsonLineString.geometry;
      } else if (
        geojsonLineString &&
        (geojsonLineString.type === "LineString" ||
          geojsonLineString.type === "MultiLineString") &&
        Array.isArray(geojsonLineString.coordinates)
      ) {
        geometry = geojsonLineString;
      } else {
        console.warn(
          "drawRoute: unsupported geometry shape:",
          geojsonLineString
        );
        return;
      }

      // Remove existing route layer + route endpoint markers (do NOT remove pickup/destination markers)
      try {
        safeRemoveLayer(map, routeLayerRef);
      } catch (err) {
        console.debug &&
          console.debug("drawRoute: safe remove route layer failed:", err);
      }

      try {
        safeRemoveLayer(map, routeStartMarkerRef);
        safeRemoveLayer(map, routeEndMarkerRef);
      } catch (err) {
        console.debug &&
          console.debug("drawRoute: safe remove markers failed:", err);
      }

      // Convert coordinates -> latlngs robustly
      let latLngs = [];
      try {
        if (geometry.type === "LineString") {
          latLngs = geometry.coordinates
            .filter((c) => Array.isArray(c) && c.length >= 2)
            .map(([lon, lat]) => [lat, lon]);
        } else if (geometry.type === "MultiLineString") {
          const flattened = geometry.coordinates.reduce((acc, line) => {
            if (Array.isArray(line)) return acc.concat(line);
            return acc;
          }, []);
          latLngs = flattened
            .filter((c) => Array.isArray(c) && c.length >= 2)
            .map(([lon, lat]) => [lat, lon]);
        }
      } catch (err) {
        console.error("drawRoute: failed converting coords:", err);
      }

      // Add polyline (or geoJSON fallback)
      try {
        if (latLngs.length >= 2) {
          routeLayerRef.current = L.polyline(latLngs, {
            weight: 6,
            color: "#06b6d4",
            opacity: 0.95,
            lineJoin: "round",
            interactive: false,
          }).addTo(map);

          if (
            routeLayerRef.current &&
            typeof routeLayerRef.current.bringToFront === "function"
          ) {
            try {
              routeLayerRef.current.bringToFront();
            } catch (err) {
              console.debug && console.debug("bringToFront failed:", err);
            }
          }
        } else {
          routeLayerRef.current = L.geoJSON(geometry, {
            style: { weight: 6, color: "#06b6d4", opacity: 0.95 },
          }).addTo(map);
        }
      } catch (err) {
        console.warn(
          "drawRoute: polyline/geoJSON creation failed, attempting fallback:",
          err
        );
        try {
          routeLayerRef.current = L.geoJSON(geometry, {
            style: { weight: 6, color: "#06b6d4", opacity: 0.95 },
          }).addTo(map);
        } catch (err2) {
          console.error("drawRoute: final fallback also failed:", err2);
          throw err2;
        }
      }

      // Add small start/end markers (use separate refs so we don't clobber pickup/destination markers)
      try {
        if (latLngs.length >= 2) {
          const start = latLngs[0];
          const end = latLngs[latLngs.length - 1];

          routeStartMarkerRef.current = L.circleMarker(start, {
            radius: 6,
            fillColor: "#10b981",
            color: "#fff",
            weight: 2,
            fillOpacity: 1,
          }).addTo(map);

          routeEndMarkerRef.current = L.circleMarker(end, {
            radius: 6,
            fillColor: "#ef4444",
            color: "#fff",
            weight: 2,
            fillOpacity: 1,
          }).addTo(map);

          try {
            if (
              routeStartMarkerRef.current &&
              typeof routeStartMarkerRef.current.bringToFront === "function"
            ) {
              routeStartMarkerRef.current.bringToFront();
            }
          } catch (err) {
            console.debug && console.debug("bringToFront start failed:", err);
          }
          try {
            if (
              routeEndMarkerRef.current &&
              typeof routeEndMarkerRef.current.bringToFront === "function"
            ) {
              routeEndMarkerRef.current.bringToFront();
            }
          } catch (err) {
            console.debug && console.debug("bringToFront end failed:", err);
          }
        }
      } catch (err) {
        console.warn("drawRoute: endpoint markers failed:", err);
      }

      // fit bounds (invalidate size first to handle hidden/animated map containers)
      ensureMapInvalidate(map, 80);

      setTimeout(() => {
        try {
          if (!map || !map._loaded) {
            console.warn("Map not ready for fitBounds");
            return;
          }

          const bounds =
            routeLayerRef.current &&
            typeof routeLayerRef.current.getBounds === "function"
              ? routeLayerRef.current.getBounds()
              : latLngs && latLngs.length >= 2
              ? L.latLngBounds(latLngs)
              : null;

          if (
            bounds &&
            typeof bounds.isValid === "function" &&
            bounds.isValid()
          ) {
            ensureMapInvalidate(map, 0); // force size check first
            map.fitBounds(bounds, { padding: [40, 40] });
          } else if (latLngs && latLngs.length >= 2) {
            map.setView(latLngs[Math.floor(latLngs.length / 2)], 13, {
              animate: true,
            });
          }
          console.log("drawRoute: finished, layer & bounds applied");
        } catch (err) {
          console.warn("drawRoute: fitBounds failed:", err);
        }
      }, 120);
    }

    /* ----- clearRoute ----- */

    function clearRoute() {
      const map = mapRef.current;
      if (!map) return;

      try {
        safeRemoveLayer(map, routeLayerRef);
      } catch (err) {
        console.debug &&
          console.debug("clearRoute: removing routeLayer failed:", err);
      }

      try {
        safeRemoveLayer(map, routeStartMarkerRef);
        safeRemoveLayer(map, routeEndMarkerRef);
      } catch (err) {
        console.debug &&
          console.debug("clearRoute: removing endpoint markers failed:", err);
      }

      try {
        stopLiveRoute();
      } catch (err) {
        console.debug &&
          console.debug("clearRoute: stopLiveRoute failed:", err);
      }
    }

    function setMarkers({ pickup, destination }) {
      const map = mapRef.current;
      if (!map) return;

      // cleanup existing
      if (pickupMarkerRef.current) {
        try {
          map.removeLayer(pickupMarkerRef.current);
        } catch (err) {
          console.warn("Failed to remove pickup marker:", err);
        }
        pickupMarkerRef.current = null;
      }
      if (destMarkerRef.current) {
        try {
          map.removeLayer(destMarkerRef.current);
        } catch (err) {
          console.warn("Failed to remove dest marker:", err);
        }
        destMarkerRef.current = null;
      }

      if (pickup) {
        pickupMarkerRef.current = L.marker([pickup.lat, pickup.lon], {
          title: "Pickup",
        }).addTo(map);
      }
      if (destination) {
        destMarkerRef.current = L.marker([destination.lat, destination.lon], {
          title: "Destination",
        }).addTo(map);
      }

      // Fit to markers if both exist
      if (pickup && destination) {
        const group = L.featureGroup([
          pickupMarkerRef.current,
          destMarkerRef.current,
        ]);
        map.fitBounds(group.getBounds(), { padding: [40, 40] });
      } else if (pickup) {
        map.setView([pickup.lat, pickup.lon], 15, { animate: true });
      } else if (destination) {
        map.setView([destination.lat, destination.lon], 15, { animate: true });
      }
    }

    function clearMarkers() {
      const map = mapRef.current;
      if (pickupMarkerRef.current) {
        try {
          map.removeLayer(pickupMarkerRef.current);
        } catch (err) {
          console.warn("Failed to remove pickup marker:", err);
        }
        pickupMarkerRef.current = null;
      }
      if (destMarkerRef.current) {
        try {
          map.removeLayer(destMarkerRef.current);
        } catch (err) {
          console.warn("Failed to remove dest marker:", err);
        }
        destMarkerRef.current = null;
      }
    }

    // ---------- Live-route helpers ----------
    function stopLiveRoute() {
      const map = mapRef.current;
      if (!map) return;
      if (liveAnimRef.current) {
        if (liveAnimRef.current.reqId)
          cancelAnimationFrame(liveAnimRef.current.reqId);
        if (liveAnimRef.current.marker) {
          try {
            map.removeLayer(liveAnimRef.current.marker);
          } catch (err) {
            console.warn("Failed to remove live marker:", err);
          }
        }
        liveAnimRef.current = null;
      }
    }

    function startLiveRoute(
      geojsonLineString,
      {
        durationSeconds = null,
        onUpdate = null,
        onFinish = null,
        speedMultiplier = 1,
        followMarker = true,
      } = {}
    ) {
      const map = mapRef.current;
      if (!map) return;
      if (!geojsonLineString || !geojsonLineString.coordinates) return;

      // stop previous
      stopLiveRoute();

      const coords = geojsonLineString.coordinates;
      if (!coords || coords.length < 2) return;

      // convert to LatLng objects
      const latlngs = coords.map(([lon, lat]) => L.latLng(lat, lon));

      // build cumulative lengths
      const segLengths = [];
      const cumLengths = [0];
      for (let i = 0; i < latlngs.length - 1; i++) {
        const len = latlngs[i].distanceTo(latlngs[i + 1]); // meters
        segLengths.push(len);
        cumLengths.push(cumLengths[cumLengths.length - 1] + len);
      }
      const totalDistance = cumLengths[cumLengths.length - 1];
      // speed meters/sec (use OSRM duration if provided; otherwise default)
      const speed =
        durationSeconds && durationSeconds > 0
          ? (totalDistance / durationSeconds) * (speedMultiplier || 1)
          : 8.33; // ≈30km/h as fallback (8.33 m/s)

      // create marker (simple circle marker)
      const marker = L.circleMarker(latlngs[0], {
        radius: 7,
        fillColor: "#06b6d4",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);

      // optionally center map on start
      if (followMarker) {
        map.panTo(latlngs[0], { animate: true, duration: 0.3 });
      }

      liveAnimRef.current = {
        reqId: null,
        lastTs: null,
        distanceTraveled: 0,
        totalDistance,
        speed,
        marker,
        latlngs,
        segLengths,
        cumLengths,
        onUpdate,
        onFinish,
        followMarker,
      };

      function frame(now) {
        const a = liveAnimRef.current;
        if (!a) return;
        if (!a.lastTs) a.lastTs = now;
        const dt = (now - a.lastTs) / 1000;
        a.lastTs = now;
        a.distanceTraveled += a.speed * dt;

        if (a.distanceTraveled >= a.totalDistance) {
          const last = a.latlngs[a.latlngs.length - 1];
          try {
            a.marker.setLatLng(last);
          } catch (err) {
            console.warn("Failed to set final marker position:", err);
          }
          a.onUpdate?.({
            remainingDistanceMeters: 0,
            remainingDurationSeconds: 0,
            position: { lat: last.lat, lon: last.lng },
          });
          cancelAnimationFrame(a.reqId);
          liveAnimRef.current = null;
          a.onFinish?.();
          return;
        }

        const dist = a.distanceTraveled;
        let idx = 0;
        while (idx < a.cumLengths.length - 1 && a.cumLengths[idx + 1] < dist)
          idx++;

        const segStart = a.latlngs[idx];
        const segEnd = a.latlngs[idx + 1];
        const segLen = a.segLengths[idx] || 0;
        const distIntoSeg = dist - a.cumLengths[idx];
        const frac = segLen === 0 ? 0 : distIntoSeg / segLen;
        const curLat = segStart.lat + (segEnd.lat - segStart.lat) * frac;
        const curLng = segStart.lng + (segEnd.lng - segStart.lng) * frac;

        try {
          a.marker.setLatLng([curLat, curLng]);
        } catch (err) {
          console.warn("Failed to update live marker position:", err);
        }

        if (a.followMarker) {
          map.panTo([curLat, curLng], { animate: true, duration: 0.1 });
        }

        const remaining = Math.max(0, a.totalDistance - a.distanceTraveled);
        const remainingDuration = a.speed > 0 ? remaining / a.speed : 0;

        a.onUpdate?.({
          remainingDistanceMeters: Math.round(remaining),
          remainingDurationSeconds: Math.round(remainingDuration),
          position: { lat: curLat, lon: curLng },
        });

        a.reqId = requestAnimationFrame(frame);
      }

      liveAnimRef.current.reqId = requestAnimationFrame(frame);
    }

    /* ----- OSRM helper (local, simple) ----- */
    function coordsArrayToOsrmString(arr) {
      // arr: [{ lat, lon }, ...] or [[lat,lon], ...]
      const parts = arr.map((p) => {
        if (Array.isArray(p)) {
          return `${Number(p[1])},${Number(p[0])}`; // [lat, lon] -> lon,lat
        }
        const lat = Number(p.lat ?? p.latitude);
        const lon = Number(p.lon ?? p.lng ?? p.longitude);
        return `${lon},${lat}`;
      });
      return parts.join(";");
    }

    async function fetchOsrmRoute(
      coordsStr,
      {
        profile = "driving",
        geometries = "geojson",
        overview = "full",
        steps = false,
        alternatives = false,
        signal,
      } = {}
    ) {
      const base = "https://router.project-osrm.org/route/v1"; // replace with your own OSRM endpoint if needed
      const qs = new URLSearchParams();
      qs.set("geometries", geometries);
      qs.set("overview", overview);
      if (steps) qs.set("steps", "true");
      if (alternatives) qs.set("alternatives", "true");

      const url = `${base}/${profile}/${coordsStr}?${qs.toString()}`;
      const resp = await fetch(url, { signal });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`OSRM request failed ${resp.status}: ${txt}`);
      }
      return resp.json();
    }

    /* ----- New: distance/route helpers that expect coordinates (Nominatim removed) ----- */

    function normalizeToCoord(input) {
      // Accepts {lat,lon} | {lat,lng} | {latitude,longitude} | [lat,lon]
      if (!input) return null;
      if (Array.isArray(input) && input.length >= 2) {
        return { lat: Number(input[0]), lon: Number(input[1]) };
      }
      if (typeof input === "object") {
        const lat = Number(input.lat ?? input.latitude);
        const lon = Number(input.lon ?? input.lng ?? input.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
        return { lat, lon, display_name: input.display_name };
      }
      return null;
    }

    /**
     * distanceBetweenAddresses(src, dst, opts):
     * - NOW expects src and dst to already be coordinates (objects or arrays).
     * - If a string is passed, an informative error is thrown because geocoding logic
     *   (Nominatim) has been removed from this component. Geocode externally and
     *   pass coordinates.
     *
     * Returns: { pickup, destination, distanceMeters, durationSeconds, method, osrmResp? }
     */
    async function distanceBetweenAddresses(src, dst, opts = {}) {
      const map = mapRef.current;
      if (!map) throw new Error("Map not ready");
      if (!src || !dst) throw new Error("Source and destination are required");

      if (typeof src === "string" || typeof dst === "string") {
        throw new Error(
          "Geocoding removed: pass coordinate objects (e.g. {lat, lon}) or arrays [lat, lon].\n" +
            "Use your own geocoder (Nominatim, Google, etc.) outside this component."
        );
      }

      // cancel previous routing request if any
      if (routeReqControllerRef.current) {
        try {
          routeReqControllerRef.current.abort();
        } catch (err) {
          console.debug && console.debug("Previous route abort failed:", err);
        }
        routeReqControllerRef.current = null;
      }

      const controller = new AbortController();
      routeReqControllerRef.current = controller;
      const { signal } = controller;

      try {
        const srcRes = normalizeToCoord(src);
        const dstRes = normalizeToCoord(dst);
        if (!srcRes || !dstRes)
          throw new Error("Invalid source/destination coordinates");

        const pickup = {
          lat: Number(srcRes.lat),
          lon: Number(srcRes.lon),
          display_name: srcRes.display_name,
        };
        const destination = {
          lat: Number(dstRes.lat),
          lon: Number(dstRes.lon),
          display_name: dstRes.display_name,
        };

        try {
          setMarkers({ pickup, destination });
        } catch (err) {
          console.warn("setMarkers failed:", err);
        }

        // Try OSRM route with overview=false (no geometry) to get distance/duration
        const coordsStr = coordsArrayToOsrmString([srcRes, dstRes]);
        let osrmResp = null;
        try {
          osrmResp = await fetchOsrmRoute(coordsStr, {
            profile: opts.profile || "driving",
            overview: "false",
            steps: false,
            alternatives: false,
            signal,
          });
        } catch (err) {
          if (err && err.name === "AbortError") {
            console.log("distanceBetweenAddresses aborted");
            throw err;
          }
          console.warn(
            "OSRM distance request failed, falling back to Haversine:",
            err
          );
          osrmResp = null;
        }

        if (
          osrmResp &&
          Array.isArray(osrmResp.routes) &&
          osrmResp.routes.length > 0 &&
          typeof osrmResp.routes[0].distance === "number"
        ) {
          const route = osrmResp.routes[0];
          return {
            pickup,
            destination,
            distanceMeters: Math.round(route.distance),
            durationSeconds: Math.round(route.duration),
            method: "osrm",
            osrmResp,
          };
        }

        // Fallback: Haversine distance + profile-based speed estimate
        function haversine(lat1, lon1, lat2, lon2) {
          const toRad = (v) => (v * Math.PI) / 180;
          const R = 6371000; // meters
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        }

        const distanceMeters = Math.round(
          haversine(pickup.lat, pickup.lon, destination.lat, destination.lon)
        );

        const speedByProfile = {
          driving: 8.33,
          cycling: 5.56,
          walking: 1.4,
        };
        const speedMetersPerSec =
          opts.speedMetersPerSec ||
          speedByProfile[opts.profile] ||
          speedByProfile.driving;

        const durationSeconds = Math.max(
          0,
          Math.round(distanceMeters / speedMetersPerSec)
        );

        return {
          pickup,
          destination,
          distanceMeters,
          durationSeconds,
          method: "haversine",
        };
      } catch (err) {
        if (err && err.name === "AbortError") {
          console.log("distanceBetweenAddresses aborted");
          throw err;
        }
        console.error("distanceBetweenAddresses error:", err);
        throw err;
      } finally {
        routeReqControllerRef.current = null;
      }
    }

    /* ----- routeBetweenAddresses: expects coordinates (geocoding removed) ----- */
    async function routeBetweenAddresses(src, dst, opts = {}) {
      const map = mapRef.current;
      if (!map) throw new Error("Map not ready");
      if (!src || !dst) throw new Error("Source and destination are required");

      if (typeof src === "string" || typeof dst === "string") {
        throw new Error(
          "Geocoding removed: pass coordinate objects (e.g. {lat, lon}) or arrays [lat, lon]."
        );
      }

      if (routeReqControllerRef.current) {
        try {
          routeReqControllerRef.current.abort();
        } catch (err) {
          console.debug && console.debug("Previous route abort failed:", err);
        }
        routeReqControllerRef.current = null;
      }

      const controller = new AbortController();
      routeReqControllerRef.current = controller;
      const { signal } = controller;

      try {
        const srcRes = normalizeToCoord(src);
        const dstRes = normalizeToCoord(dst);
        if (!srcRes || !dstRes)
          throw new Error("Invalid source/destination coordinates");

        const pickup = {
          lat: Number(srcRes.lat),
          lon: Number(srcRes.lon),
          display_name: srcRes.display_name,
        };
        const destination = {
          lat: Number(dstRes.lat),
          lon: Number(dstRes.lon),
          display_name: dstRes.display_name,
        };

        try {
          setMarkers({ pickup, destination });
        } catch (err) {
          console.warn("setMarkers failed:", err);
        }

        const coordsStr = coordsArrayToOsrmString([srcRes, dstRes]);
        const osrmResp = await fetchOsrmRoute(coordsStr, {
          profile: opts.profile || "driving",
          geometries: "geojson",
          overview: "full",
          steps: !!opts.steps,
          alternatives: !!opts.alternatives,
          signal,
        });

        if (
          !osrmResp ||
          !Array.isArray(osrmResp.routes) ||
          osrmResp.routes.length === 0
        ) {
          throw new Error("OSRM returned no routes.");
        }

        const route = osrmResp.routes[0];
        const geometry = route.geometry || route; // prefer geojson geometry

        try {
          drawRoute(geometry);
        } catch (err) {
          console.warn("drawRoute failed:", err);
        }

        if (opts.startLive) {
          try {
            startLiveRoute(geometry, {
              durationSeconds: route.duration,
              onUpdate: opts.onUpdate,
              onFinish: opts.onFinish,
              speedMultiplier: opts.speedMultiplier ?? 1,
              followMarker: opts.followMarker ?? true,
            });
          } catch (err) {
            console.warn("startLiveRoute failed:", err);
          }
        }

        return { pickup, destination, route, osrmResp };
      } catch (err) {
        if (err && err.name === "AbortError") {
          console.log("routeBetweenAddresses aborted");
          throw err;
        }
        console.error("routeBetweenAddresses error:", err);
        throw err;
      } finally {
        routeReqControllerRef.current = null;
      }
    }

    function cancelRouting() {
      if (routeReqControllerRef.current) {
        try {
          routeReqControllerRef.current.abort();
        } catch (err) {
          console.debug && console.debug("cancelRouting abort failed:", err);
        }
        routeReqControllerRef.current = null;
      }
    }

    onReady?.({
      map: mapRef.current,
      drawRoute,
      clearRoute,
      setMarkers,
      clearMarkers,
      startLiveRoute,
      stopLiveRoute,
      // new helpers exposed to parent components
      routeBetweenAddresses,
      cancelRouting,
      // distance-only helper (no route geometry fetched or drawn)
      distanceBetweenAddresses,
    });

    const handleResize = () => mapRef.current?.invalidateSize();
    window.addEventListener("map:resize", handleResize);
    return () => {
      window.removeEventListener("map:resize", handleResize);
      if (liveAnimRef.current?.reqId)
        cancelAnimationFrame(liveAnimRef.current.reqId);
      if (liveAnimRef.current?.marker) {
        try {
          mapRef.current.removeLayer(liveAnimRef.current.marker);
        } catch (err) {
          console.warn("Failed to remove live marker during cleanup:", err);
        }
      }
      try {
        if (routeReqControllerRef.current)
          routeReqControllerRef.current.abort();
      } catch (err) {
        console.debug && console.debug("cleanup abort failed:", err);
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onReady, center, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  return <div ref={mapEl} className="absolute inset-0 z-0" />;
}