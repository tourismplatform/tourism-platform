import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SupabaseService } from '../supabase.service';

@ApiTags('Destinations')
@Controller()
export class DestinationsController {
  constructor(
    private destinationsService: DestinationsService,
    private supabase: SupabaseService,
  ) {}

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

  @Put('admin/destinations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDestinationDto, @Request() req) {
    return this.destinationsService.update(id, dto, req.user.userId);
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

  @ApiOperation({ summary: 'Uploader une image sur Supabase Storage (Admin)' })
  @ApiBearerAuth()
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Image manquante');
    }

    const client = this.supabase.getClient();
    const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
    const filePath = `destinations/${fileName}`;

    const { data, error } = await client.storage
      .from('destinations')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException(`Erreur Supabase: ${error.message}`);
    }

    const { data: { publicUrl } } = client.storage
      .from('destinations')
      .getPublicUrl(filePath);

    return { url: publicUrl, message: 'Upload réussi' };
  }
}
