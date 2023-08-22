"use client";

import { FormEvent } from "react";

interface NewRoutePageProps {}

export default function NewRoutePage(props: NewRoutePageProps) {
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

    const [sourcePlace, destinationPlace] = await Promise.all([
      sourceResponse.json(),
      destinationResponse.json()
    ])

    console.log(sourcePlace, destinationPlace);
    
  }

  return (
    <div>
      <div
        style={{
          width: "400px",
          padding: "10px",
          borderRight: "2px solid grey",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Criar rota</h2>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
          onSubmit={searchPlaces}
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
          <button>Pesquisar</button>
        </form>
      </div>
    </div>
  );
}
