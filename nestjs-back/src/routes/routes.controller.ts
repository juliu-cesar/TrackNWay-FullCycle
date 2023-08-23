import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, PartialType } from '@nestjs/swagger';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteSerializer } from './route.serializer';
import { RoutesService } from './routes.service';
import { ListRouteDto } from './dto/list-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  async create(@Body() createRouteDto: CreateRouteDto) {
    const route = await this.routesService.create(createRouteDto);
    return new RouteSerializer(route);
  }

  @ApiOkResponse({
    type: ListRouteDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ListRouteDto[]> {
    const routes = await this.routesService.findAll();
    return routes.map((route) => new RouteSerializer(route));
  }

  @ApiOkResponse({
    type: ListRouteDto,
    isArray: false,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ListRouteDto> {
    const route = await this.routesService.findOne(id);
    return new RouteSerializer(route);
  }

  @ApiBody({
    type: PartialType(CreateRouteDto),
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(+id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }
}
