"use client";

import styled from "@emotion/styled";
import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { FormEvent, useRef, useState } from "react";
import { useMap } from "../hooks/usemap";

const TextFieldStyled = styled(TextField)`
  div {
    .mui-p51h6s-MuiInputBase-input-MuiOutlinedInput-input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 100px #333 inset;
    }
  }
`;

export default function NewRoutePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);
  const [directionsData, setDirectionsData] = useState<
    DirectionsResponseData & { request: any }
  >();
  const [open, setOpen] = useState(false);

  async function searchPlaces(event: FormEvent) {
    event.preventDefault();
    const source = (document.getElementById("source") as HTMLInputElement)
      .value;
    const destination = (
      document.getElementById("destination") as HTMLInputElement
    ).value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_NEXT_API_URL}/places?text=${source}`),
      fetch(
        `${process.env.NEXT_PUBLIC_NEXT_API_URL}/places?text=${destination}`
      ),
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
      `${process.env.NEXT_PUBLIC_NEXT_API_URL}/directions?originId=${placeSourceId}&destinationId=${placeDestinationsId}`
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${startAddress} - ${endAddress}`,
          source_id: directionsData!.request.origin.place_id,
          destination_id: directionsData!.request.destination.place_id,
        }),
      }
    );
    const route = await response.json();
    setOpen(true);
  }

  const classes = {
    input: {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px white inset",
      },
    },
  };
  return (
    <Grid2
      container
      sx={{
        height: "100%",
        display: "flex",
        flex: 1,
      }}
    >
      <Grid2 xs={4} px={2}>
        <Typography variant="h4" my={2}>
          Nova rota
        </Typography>
        <form onSubmit={searchPlaces}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextFieldStyled
              id="source"
              label="Origem"
              fullWidth
              inputProps={{ classes: { input: classes.input } }}
            />
            <TextFieldStyled id="destination" label="Destino" fullWidth />
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "80%", height: "45px", fontSize: "1.1rem" }}
            >
              Pesquisar
            </Button>
          </Box>
        </form>
        {directionsData && (
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ pb: 1 }}>
              <List>
                <ListItem>
                  <ListItemText
                    primary={"Origem"}
                    secondary={directionsData.routes[0]!.legs[0]!.start_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Destino"}
                    secondary={directionsData.routes[0]!.legs[0]!.end_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Distância"}
                    secondary={directionsData.routes[0]!.legs[0]!.distance.text}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"Duração"}
                    secondary={directionsData.routes[0]!.legs[0]!.duration.text}
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "center", pt: 0, pb: 2 }}
            >
              <Button
                type="button"
                variant="contained"
                onClick={createRoute}
                sx={{ width: "80%", height: "40px", fontSize: "1rem" }}
              >
                Adicionar Rota
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid2>
      <Grid2
        id="map"
        ref={mapContainerRef}
        xs={8}
        sx={{
          height: "calc(100vh - 64px)",
        }}
      ></Grid2>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success">
          Rota cadastrada com sucesso
        </Alert>
      </Snackbar>
    </Grid2>
  );
}
