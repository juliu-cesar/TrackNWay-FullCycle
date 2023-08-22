"use client";

import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import { FormEvent, useRef, useState } from "react";
import { useMap } from "../hooks/usemap";

interface NewRoutePageProps {}

export default function NewRoutePage(props: NewRoutePageProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);
  const [directionsData, setDirectionsData] = useState<
    DirectionsResponseData & { request: any }
  >();

  async function searchPlaces(event: FormEvent) {
    event.preventDefault();
    const source = (document.getElementById("source") as HTMLInputElement)
      .value;
    const destination = (
      document.getElementById("destination") as HTMLInputElement
    ).value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:3000/places?text=${source}`),
      fetch(`http://localhost:3000/places?text=${destination}`),
    ]);

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
      await Promise.all([sourceResponse.json(), destinationResponse.json()]);

    if (sourcePlace.status !== "OK") {
      console.error(sourcePlace);
      alert("Não foi possível encontrar a origem.");
      return;
    }
    if (destinationPlace.status !== "OK") {
      console.error(destinationPlace);
      alert("Não foi possível encontrar o destino.");
      return;
    }

    const placeSourceId = sourcePlace.candidates[0].place_id;
    const placeDestinationsId = destinationPlace.candidates[0].place_id;

    const directionsResponse = await fetch(
      `http://localhost:3000/directions?originId=${placeSourceId}&destinationId=${placeDestinationsId}`
    );

    const directionData: DirectionsResponseData & { request: any } =
      await directionsResponse.json();
    setDirectionsData(directionData);
    map?.removeAllRoutes();
    await map?.addRouteWithIcons({
      routeId: "1",
      startMarkerOptions: {
        position: directionData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionData.routes[0].legs[0].start_location,
      },
    });
  }

  async function createRoute() {
    const startAddress = directionsData!.routes[0].legs[0].start_address;
    const endAddress = directionsData!.routes[0].legs[0].end_address;
    const response = await fetch("http://localhost:3000/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${startAddress} - ${endAddress}`,
        source_id: directionsData!.request.origin.place_id,
        destination_id: directionsData!.request.destination.place_id,
      }),
    });
    const route = await response.json();
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
        <h2>Criar rota</h2>
        <form
          onSubmit={searchPlaces}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            className="inputText"
            type="text"
            name=""
            id="source"
            placeholder="Origem"
          />
          <input
            className="inputText"
            type="text"
            name=""
            id="destination"
            placeholder="Destino"
          />
          <button
            style={{
              width: "70%",
              height: 50,
              borderRadius: "8px",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Pesquisar
          </button>
        </form>
        {directionsData && (
          <ul>
            <li>Origem {directionsData.routes[0].legs[0].start_address}</li>
            <li>Destino {directionsData.routes[0].legs[0].end_address}</li>
            <li>
              <button onClick={createRoute} style={{padding: "8px", backgroundColor: "grey", borderRadius: "8px"}}>Criar rota</button>
            </li>
          </ul>
        )}
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
