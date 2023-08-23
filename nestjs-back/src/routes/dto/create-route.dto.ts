import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  source_id: string;
  @ApiProperty()
  destination_id: string;
}
