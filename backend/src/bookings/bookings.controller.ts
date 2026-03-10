import {
  Controller, Post, Get, Put, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Créer une réservation' })
  @Post('bookings')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(dto, req.user.userId);
  }

  @ApiOperation({ summary: 'Mes réservations' })
  @Get('bookings/my')
  @UseGuards(JwtAuthGuard)
  findMyBookings(@Request() req) {
    return this.bookingsService.findMyBookings(req.user.userId);
  }

  @ApiOperation({ summary: "Détail d'une réservation" })
  @Get('bookings/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Toutes les réservations (Admin)' })
  @Get('admin/bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.bookingsService.findAll();
  }

  @ApiOperation({ summary: 'Confirmer ou annuler une réservation (Admin)' })
  @Put('admin/bookings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ) {
    return this.bookingsService.updateStatus(id, status);
  }
}
