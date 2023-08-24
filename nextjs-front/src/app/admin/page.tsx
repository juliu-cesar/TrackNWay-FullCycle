"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../hooks/usemap";
import { Route } from "../utils/model";
import { socket } from "../utils/socket-io";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";

interface NewRoutePageProps {}

export default function AdminPage(props: NewRoutePageProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    socket.connect();

    socket.on(
      "admin-new-points",
      async (data: { route_id: string; lat: number; lng: number }) => {
        if (!map?.hasRoute(data.route_id)) {
          const response = await fetch(
            `http://localhost:3000/routes/${data.route_id}`
          );
          const route: Route = await response.json();
          map?.removeRoute(data.route_id);

          await map?.addRouteWithIcons({
            routeId: data.route_id,
            startMarkerOptions: {
              position: route.directions.routes[0].legs[0].start_location,
            },
            endMarkerOptions: {
              position: route.directions.routes[0].legs[0].end_location,
            },
            carMarkerOptions: {
              position: route.directions.routes[0].legs[0].start_location,
            },
          });
        }
        map?.moveCar(data.route_id, {
          lat: data.lat,
          lng: data.lng,
        });
      }
    );
    return () => {
      socket.disconnect();
    };
  }, [map]);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
      }}
    >
      <Box id="map" ref={mapContainerRef} sx={{ height: "100%" }}></Box>
    </div>
  );
}
