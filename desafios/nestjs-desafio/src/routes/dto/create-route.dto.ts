export class CreateRouteDto {
  name: string;
  source: Coord;
  destination: Coord;
}
type Coord = {
  lat: number;
  lng: number;
};
