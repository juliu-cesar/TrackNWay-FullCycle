import type { DirectionsResponseData } from '@googlemaps/google-maps-services-js';
import { ApiProperty } from '@nestjs/swagger';
import { Route } from '@prisma/client';

export class TypeLocation {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
}

class TypeSourceAndDestination {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: TypeLocation })
  location: TypeLocation;
}

export class ListRouteDto implements Omit<Route, 'direction'> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: TypeSourceAndDestination })
  source: TypeSourceAndDestination;
  @ApiProperty({ type: TypeSourceAndDestination })
  destination: TypeSourceAndDestination;
  @ApiProperty()
  distance: number;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  directions: DirectionsResponseData & { request: any };
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
