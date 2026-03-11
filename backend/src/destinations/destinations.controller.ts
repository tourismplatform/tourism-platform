import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Destinations')
@Controller()
export class DestinationsController {
  constructor(private destinationsService: DestinationsService) {}

  @ApiOperation({ summary: 'Lister les destinations avec filtres' })
  @Get('destinations')
  findAll(@Query() filters: FilterDestinationDto) {
    return this.destinationsService.findAll(filters);
  }

  @ApiOperation({ summary: "Détail d'une destination" })
  @Get('destinations/:id')
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Créer une destination (Admin)' })
  @ApiBearerAuth()
  @Post('admin/destinations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateDestinationDto, @Request() req) {
    return this.destinationsService.create(dto, req.user.userId);
  }

  @ApiOperation({ summary: 'Modifier une destination (Admin)' })
  @ApiBearerAuth()
  @Put('admin/destinations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDestinationDto) {
    return this.destinationsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Supprimer une destination (Admin)' })
  @ApiBearerAuth()
  @Delete('admin/destinations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }

  @ApiOperation({ summary: 'Ajouter une image (Admin)' })
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string', example: 'https://example.com/image.jpg' }, isCover: { type: 'boolean', example: false } } } })
  @Post('admin/destinations/:id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  addImage(
    @Param('id') id: string,
    @Body('url') imageUrl: string,
    @Body('isCover') isCover: boolean = false,
    @Request() req,
  ) {
    return this.destinationsService.addImage(id, imageUrl, isCover, req.user.userId);
  }
}
