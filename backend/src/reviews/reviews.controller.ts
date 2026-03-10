import { Controller, Post, Get, Delete, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({ summary: "Laisser un avis (doit avoir visité)" })
  @ApiBearerAuth()
  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(dto, req.user.userId);
  }

  @ApiOperation({ summary: "Avis d'une destination (public)" })
  @Get('reviews/:destId')
  findByDestination(@Param('destId') destId: string) {
    return this.reviewsService.findByDestination(destId);
  }

  @ApiOperation({ summary: 'Supprimer un avis (Admin)' })
  @ApiBearerAuth()
  @Delete('admin/reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

  @ApiOperation({ summary: 'Cacher un avis (Admin)' })
  @ApiBearerAuth()
  @Put('admin/reviews/:id/hide')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  hide(@Param('id') id: string) {
    return this.reviewsService.hide(id);
  }
}
