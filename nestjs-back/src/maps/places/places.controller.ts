import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { ListPlacesDto } from '../dto/list-places.dto';

@Controller('places')
export class PlacesController {
  constructor(private placeService: PlacesService) {}

  @ApiOkResponse({
    type: ListPlacesDto,
    isArray: false,
  })
  @Get()
  findPlace(@Query('text') text: string) {
    return this.placeService.findPlace(text);
  }
}
