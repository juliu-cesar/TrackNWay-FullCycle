import { ApiProperty } from '@nestjs/swagger';
import { TypeLocation } from 'src/routes/dto/list-route.dto';

class TypeViewPort {
  @ApiProperty({ type: TypeLocation })
  northeast: TypeLocation;
  @ApiProperty({ type: TypeLocation })
  southwest: TypeLocation;
}
class TypeGeometry {
  @ApiProperty({ type: TypeLocation })
  location: TypeLocation;
  @ApiProperty({ type: TypeViewPort })
  viewport: TypeViewPort;
}
class TypeCandidates {
  @ApiProperty()
  formatted_address: string;
  @ApiProperty({ type: TypeGeometry })
  geometry: TypeGeometry;
  @ApiProperty()
  name: string;
  @ApiProperty()
  place_id: string;
}

export class ListPlacesDto {
  @ApiProperty({ type: [TypeCandidates] })
  candidates: TypeCandidates[];
  @ApiProperty()
  status: string;
}
