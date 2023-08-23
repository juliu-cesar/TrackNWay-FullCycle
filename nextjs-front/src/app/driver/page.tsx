"use client";

import { useRef } from "react";
import useSwr from "swr";
import { useMap } from "../hooks/usemap";
import { fetcher } from "../utils/http";
import { Route } from "../utils/model";

interface NewRoutePageProps {}

export default function DriverPage(props: NewRoutePageProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  const {
    data: routes,
    error,
    isLoading,
  } = useSwr<Route[]>("http://localhost:3000/routes", fetcher, {
    fallbackData: [],
  });

  async function startRoute() {
    const routeId = (document.getElementById("route") as HTMLSelectElement)
      .value;
    const response = await fetch(`http://localhost:3000/routes/${routeId}`);
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
    for(const step of steps){
      await sleep(2000);
      map?.moveCar(routeId, step.start_location)
      await sleep(2000);
      map?.moveCar(routeId, step.end_location)
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          borderRight: "2px solid grey",
        }}
      >
        <h2>Minha viagem</h2>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <select
            name="route"
            id="route"
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "4px",
            }}
          >
            {isLoading && <option>Carregando rotas...</option>}
            {routes!.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
          <button
            onClick={startRoute}
            style={{
              width: "70%",
              height: 50,
              borderRadius: "8px",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Iniciar a viagem
          </button>
        </div>
      </div>
      <div
        id="map"
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
    </div>
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
