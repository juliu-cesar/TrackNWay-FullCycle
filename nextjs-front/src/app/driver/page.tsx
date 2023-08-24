"use client";

import { Button, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useRef } from "react";
import RouteSelect from "../components/RouteSelect";
import { useMap } from "../hooks/usemap";
import { Route } from "../utils/model";
import { socket } from "../utils/socket-io";

interface NewRoutePageProps {}

export default function DriverPage(props: NewRoutePageProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  async function startRoute() {
    const routeId = (document.getElementById("route") as HTMLSelectElement)
      .value;
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes/${routeId}`);
    const route: Route = await response.json();

    map?.removeAllRoutes();
    await map?.addRouteWithIcons({
      routeId: routeId,
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

    const { steps } = route.directions.routes[0].legs[0];
    for (const step of steps) {
      await sleep(2000);
      map?.moveCar(routeId, step.start_location);
      socket.emit("new-points", {
        route_id: routeId,
        lat: step.start_location.lat,
        lng: step.start_location.lng,
      });

      await sleep(2000);
      map?.moveCar(routeId, step.end_location);
      socket.emit("new-points", {
        route_id: routeId,
        lat: step.end_location.lat,
        lng: step.end_location.lng,
      });
    }
  }

  return (
    <Grid2
      container
      sx={{
        display: "flex",
        flex: 1,
      }}
    >
      <Grid2 xs={4} px={2}>
        <Typography variant="h4" my={2}>Minha viagem</Typography>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <RouteSelect id="route" />
          <Button
            onClick={startRoute}
            variant="contained"
            sx={{
              width: "80%",
              height: 50,
              my: 1,
              fontSize: "1.1rem",
            }}
          >
            Iniciar a viagem
          </Button>
        </div>
      </Grid2>
      <Grid2
        id="map"
        ref={mapContainerRef}
        xs={8}
        sx={{
          height: "calc(100vh - 64px)",
        }}
      ></Grid2>
    </Grid2>
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
