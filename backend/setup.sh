#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
#  SETUP SCRIPT — Tourism Platform Backend (Eddy)
#  Usage : bash setup.sh
#  Dossier : exécuter depuis tourism-platform-1/backend/
# ═══════════════════════════════════════════════════════════════════

set -e  # Stoppe si une commande échoue

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║   Tourism Platform — Setup Eddy (API)    ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Vérifier qu'on est dans le bon dossier ────────────────────────
if [ ! -f "package.json" ]; then
  echo -e "${YELLOW}⚠️  Lance ce script depuis le dossier backend/ du projet${NC}"
  echo "   cd tourism-platform-1/backend && bash setup.sh"
  exit 1
fi

echo -e "${BLUE}📁 Étape 1/3 — Création des dossiers...${NC}"
mkdir -p src/common/decorators
mkdir -p src/destinations/dto
mkdir -p src/bookings/dto
mkdir -p src/payments/dto
mkdir -p src/reviews/dto
mkdir -p src/admin
echo -e "${GREEN}✅ Dossiers créés${NC}"

echo ""
echo -e "${BLUE}📝 Étape 2/3 — Création des fichiers...${NC}"

# ──────────────────────────────────────────────────────────────────
# COMMON — Decorator & Guard
# ──────────────────────────────────────────────────────────────────

cat > src/common/decorators/roles.decorator.ts << 'ENDOFFILE'
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
ENDOFFILE

cat > src/common/guards/roles.guard.ts << 'ENDOFFILE'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.includes(user.role);
  }
}
ENDOFFILE

echo "  ✔ common/decorators/roles.decorator.ts"
echo "  ✔ common/guards/roles.guard.ts"

# ──────────────────────────────────────────────────────────────────
# MODULE DESTINATIONS
# ──────────────────────────────────────────────────────────────────

cat > src/destinations/dto/create-destination.dto.ts << 'ENDOFFILE'
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryEnum {
  NATURE = 'NATURE',
  HISTORY = 'HISTORY',
  BEACH = 'BEACH',
  CIRCUIT = 'CIRCUIT',
}

export class CreateDestinationDto {
  @ApiProperty({ example: 'Cascades de Banfora' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Magnifiques cascades situées à Banfora' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty({ example: 'Banfora, Burkina Faso' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  price_per_person: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  capacity: number;
}
ENDOFFILE

cat > src/destinations/dto/update-destination.dto.ts << 'ENDOFFILE'
import { PartialType } from '@nestjs/swagger';
import { CreateDestinationDto } from './create-destination.dto';

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}
ENDOFFILE

cat > src/destinations/dto/filter-destination.dto.ts << 'ENDOFFILE'
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDestinationDto {
  @ApiPropertyOptional({ example: 'NATURE' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;
}
ENDOFFILE

cat > src/destinations/destinations.service.ts << 'ENDOFFILE'
import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(filters: FilterDestinationDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('destinations')
      .select('*, destination_images(*)')
      .eq('status', 'PUBLISHED');

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.minPrice) query = query.gte('price_per_person', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price_per_person', filters.maxPrice);
    if (filters.minRating) query = query.gte('avg_rating', filters.minRating);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return { data, message: 'Destinations récupérées' };
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('destinations')
      .select('*, destination_images(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Destination non trouvée');
    return { data, message: 'Destination récupérée' };
  }

  async create(dto: CreateDestinationDto, adminId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('destinations')
      .insert({ ...dto, status: 'DRAFT', created_by: adminId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Destination créée' };
  }

  async update(id: string, dto: Partial<CreateDestinationDto>) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('destinations')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Destination modifiée' };
  }

  async remove(id: string) {
    const client = this.supabase.getClient();
    const { error } = await client
      .from('destinations')
      .update({ status: 'DELETED' })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { data: null, message: 'Destination supprimée' };
  }

  async addImage(destinationId: string, imageUrl: string, adminId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('destination_images')
      .insert({ destination_id: destinationId, url: imageUrl, uploaded_by: adminId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Image ajoutée' };
  }
}
ENDOFFILE

cat > src/destinations/destinations.controller.ts << 'ENDOFFILE'
import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @Post('admin/destinations/:id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  addImage(@Param('id') id: string, @Body('url') imageUrl: string, @Request() req) {
    return this.destinationsService.addImage(id, imageUrl, req.user.userId);
  }
}
ENDOFFILE

cat > src/destinations/destinations.module.ts << 'ENDOFFILE'
import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DestinationsController],
  providers: [DestinationsService, SupabaseService],
  exports: [DestinationsService],
})
export class DestinationsModule {}
ENDOFFILE

echo "  ✔ destinations/ (6 fichiers)"

# ──────────────────────────────────────────────────────────────────
# MODULE BOOKINGS
# ──────────────────────────────────────────────────────────────────

cat > src/bookings/dto/create-booking.dto.ts << 'ENDOFFILE'
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-de-la-destination' })
  @IsNotEmpty()
  @IsString()
  destination_id: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  check_in: string;

  @ApiProperty({ example: '2026-04-05' })
  @IsDateString()
  check_out: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  nb_persons: number;

  @ApiPropertyOptional({ example: 'Famille avec enfants' })
  @IsOptional()
  @IsString()
  message?: string;
}
ENDOFFILE

cat > src/bookings/bookings.service.ts << 'ENDOFFILE'
import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private supabase: SupabaseService) {}

  private async checkAvailability(
    destinationId: string, checkIn: string, checkOut: string, nbPersons: number,
  ) {
    const client = this.supabase.getClient();

    const { data: dest } = await client
      .from('destinations').select('capacity').eq('id', destinationId).single();

    if (!dest) throw new NotFoundException('Destination non trouvée');

    const { data: bookings } = await client
      .from('bookings').select('nb_persons')
      .eq('destination_id', destinationId).eq('status', 'CONFIRMED')
      .lte('check_in', checkOut).gte('check_out', checkIn);

    const totalPersons = (bookings || []).reduce((sum, b) => sum + b.nb_persons, 0);

    if (totalPersons + nbPersons > dest.capacity) {
      throw new BadRequestException('Destination complète pour ces dates');
    }
  }

  async create(dto: CreateBookingDto, userId: string) {
    await this.checkAvailability(dto.destination_id, dto.check_in, dto.check_out, dto.nb_persons);

    const client = this.supabase.getClient();
    const { data: dest } = await client
      .from('destinations').select('price_per_person').eq('id', dto.destination_id).single();

    const nights = Math.ceil(
      (new Date(dto.check_out).getTime() - new Date(dto.check_in).getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = dest.price_per_person * dto.nb_persons * (nights || 1);

    const { data, error } = await client
      .from('bookings')
      .insert({ ...dto, user_id: userId, status: 'PENDING', total_price: totalPrice })
      .select().single();

    if (error) throw new Error(error.message);
    return { data, message: 'Réservation créée avec succès' };
  }

  async findMyBookings(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings').select('*, destinations(name, location, category)')
      .eq('user_id', userId).order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Mes réservations récupérées' };
  }

  async findOne(id: string, userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings').select('*, destinations(*)')
      .eq('id', id).eq('user_id', userId).single();

    if (error || !data) throw new NotFoundException('Réservation non trouvée');
    return { data, message: 'Réservation récupérée' };
  }

  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings').select('*, destinations(name), users(email)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Toutes les réservations récupérées' };
  }

  async updateStatus(id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings').update({ status }).eq('id', id).select().single();

    if (error) throw new Error(error.message);
    return { data, message: `Réservation ${status.toLowerCase()}` };
  }
}
ENDOFFILE

cat > src/bookings/bookings.controller.ts << 'ENDOFFILE'
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
ENDOFFILE

cat > src/bookings/bookings.module.ts << 'ENDOFFILE'
import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BookingsController],
  providers: [BookingsService, SupabaseService],
  exports: [BookingsService],
})
export class BookingsModule {}
ENDOFFILE

echo "  ✔ bookings/ (4 fichiers)"

# ──────────────────────────────────────────────────────────────────
# MODULE PAYMENTS
# ──────────────────────────────────────────────────────────────────

cat > src/payments/dto/process-payment.dto.ts << 'ENDOFFILE'
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ example: 'uuid-du-booking' })
  @IsNotEmpty()
  @IsString()
  booking_id: string;
}
ENDOFFILE

cat > src/payments/payments.service.ts << 'ENDOFFILE'
import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class PaymentsService {
  constructor(private supabase: SupabaseService) {}

  async processMockPayment(bookingId: string, userId: string) {
    const client = this.supabase.getClient();

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const transactionId = `MOCK-TXN-${Date.now()}`;

    const { data: booking, error: bookingError } = await client
      .from('bookings').select('total_price, user_id').eq('id', bookingId).single();

    if (bookingError || !booking) throw new NotFoundException('Réservation non trouvée');

    const { data: payment, error } = await client
      .from('payments')
      .insert({
        booking_id: bookingId, user_id: userId,
        amount: booking.total_price, currency: 'XOF',
        method: 'MOCK', status: 'SUCCESS',
        transaction_id: transactionId, paid_at: new Date().toISOString(),
      })
      .select().single();

    if (error) throw new Error(error.message);

    await client.from('bookings').update({ status: 'CONFIRMED' }).eq('id', bookingId);

    return { data: { payment, transactionId }, message: 'Paiement effectué avec succès' };
  }

  async getPaymentStatus(bookingId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('payments').select('*').eq('booking_id', bookingId).single();

    if (error || !data) throw new NotFoundException('Paiement non trouvé');
    return { data, message: 'Statut du paiement récupéré' };
  }

  async processMockRefund(paymentId: string) {
    const client = this.supabase.getClient();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { data: payment } = await client
      .from('payments').select('booking_id, amount').eq('id', paymentId).single();

    if (!payment) throw new NotFoundException('Paiement non trouvé');

    const { data, error } = await client
      .from('payments')
      .update({ status: 'REFUNDED', refunded_at: new Date().toISOString() })
      .eq('id', paymentId).select().single();

    if (error) throw new Error(error.message);

    await client.from('bookings').update({ status: 'CANCELLED' }).eq('id', payment.booking_id);

    return { data, message: 'Remboursement effectué avec succès' };
  }
}
ENDOFFILE

cat > src/payments/payments.controller.ts << 'ENDOFFILE'
import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Effectuer un paiement simulé' })
  @Post('payments/process')
  @UseGuards(JwtAuthGuard)
  processPayment(@Body() dto: ProcessPaymentDto, @Request() req) {
    return this.paymentsService.processMockPayment(dto.booking_id, req.user.userId);
  }

  @ApiOperation({ summary: "Statut du paiement d'une réservation" })
  @Get('payments/:bookingId')
  @UseGuards(JwtAuthGuard)
  getPaymentStatus(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentStatus(bookingId);
  }

  @ApiOperation({ summary: 'Remboursement simulé (Admin)' })
  @Post('payments/refund/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  refund(@Param('id') id: string) {
    return this.paymentsService.processMockRefund(id);
  }
}
ENDOFFILE

cat > src/payments/payments.module.ts << 'ENDOFFILE'
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, SupabaseService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
ENDOFFILE

echo "  ✔ payments/ (4 fichiers)"

# ──────────────────────────────────────────────────────────────────
# MODULE REVIEWS
# ──────────────────────────────────────────────────────────────────

cat > src/reviews/dto/create-review.dto.ts << 'ENDOFFILE'
import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'uuid-de-la-destination' })
  @IsNotEmpty()
  @IsString()
  destination_id: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Superbe endroit, je recommande !' })
  @IsOptional()
  @IsString()
  comment?: string;
}
ENDOFFILE

cat > src/reviews/reviews.service.ts << 'ENDOFFILE'
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateReviewDto, userId: string) {
    const client = this.supabase.getClient();

    const { data: booking } = await client
      .from('bookings').select('id')
      .eq('user_id', userId).eq('destination_id', dto.destination_id)
      .eq('status', 'COMPLETED').single();

    if (!booking) {
      throw new BadRequestException(
        'Vous devez avoir visité cette destination pour laisser un avis',
      );
    }

    const { data: existingReview } = await client
      .from('reviews').select('id')
      .eq('user_id', userId).eq('destination_id', dto.destination_id).single();

    if (existingReview) {
      throw new BadRequestException('Vous avez déjà laissé un avis pour cette destination');
    }

    const { data, error } = await client
      .from('reviews')
      .insert({
        user_id: userId, destination_id: dto.destination_id,
        booking_id: booking.id, rating: dto.rating,
        comment: dto.comment, status: 'VISIBLE',
      })
      .select().single();

    if (error) throw new Error(error.message);

    await this.updateAvgRating(dto.destination_id);
    return { data, message: 'Avis publié' };
  }

  async findByDestination(destinationId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('reviews').select('*, users(email)')
      .eq('destination_id', destinationId).eq('status', 'VISIBLE')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Avis récupérés' };
  }

  async remove(id: string) {
    const client = this.supabase.getClient();
    const { error } = await client.from('reviews').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { data: null, message: 'Avis supprimé' };
  }

  async hide(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('reviews').update({ status: 'HIDDEN' }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return { data, message: 'Avis masqué' };
  }

  private async updateAvgRating(destinationId: string) {
    const client = this.supabase.getClient();
    const { data: reviews } = await client
      .from('reviews').select('rating')
      .eq('destination_id', destinationId).eq('status', 'VISIBLE');

    if (!reviews || reviews.length === 0) return;

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await client.from('destinations')
      .update({ avg_rating: Math.round(avg * 10) / 10 }).eq('id', destinationId);
  }
}
ENDOFFILE

cat > src/reviews/reviews.controller.ts << 'ENDOFFILE'
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
ENDOFFILE

cat > src/reviews/reviews.module.ts << 'ENDOFFILE'
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, SupabaseService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
ENDOFFILE

echo "  ✔ reviews/ (4 fichiers)"

# ──────────────────────────────────────────────────────────────────
# MODULE ADMIN
# ──────────────────────────────────────────────────────────────────

cat > src/admin/admin.service.ts << 'ENDOFFILE'
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class AdminService {
  constructor(private supabase: SupabaseService) {}

  async getStats() {
    const client = this.supabase.getClient();

    const { count: destinations } = await client
      .from('destinations').select('*', { count: 'exact' }).eq('status', 'PUBLISHED');

    const { count: pendingBookings } = await client
      .from('bookings').select('*', { count: 'exact' }).eq('status', 'PENDING');

    const { data: payments } = await client
      .from('payments').select('amount').eq('status', 'SUCCESS');

    const revenue = (payments || []).reduce((sum, p) => sum + p.amount, 0);

    const { count: users } = await client
      .from('users').select('*', { count: 'exact' });

    return {
      data: { destinations, pendingBookings, revenue, users },
      message: 'Statistiques récupérées',
    };
  }

  async getUsers() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users').select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Utilisateurs récupérés' };
  }

  async updateUserRole(userId: string, role: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users').update({ role }).eq('id', userId)
      .select('id, email, role').single();

    if (error) throw new Error(error.message);
    return { data, message: `Rôle mis à jour : ${role}` };
  }
}
ENDOFFILE

cat > src/admin/admin.controller.ts << 'ENDOFFILE'
import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({ summary: 'Statistiques globales' })
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @ApiOperation({ summary: 'Liste des utilisateurs' })
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @ApiOperation({ summary: "Changer le rôle d'un utilisateur" })
  @Put('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.updateUserRole(id, role);
  }
}
ENDOFFILE

cat > src/admin/admin.module.ts << 'ENDOFFILE'
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, SupabaseService],
})
export class AdminModule {}
ENDOFFILE

echo "  ✔ admin/ (3 fichiers)"

# ──────────────────────────────────────────────────────────────────
# app.module.ts & main.ts
# ──────────────────────────────────────────────────────────────────

cat > src/app.module.ts << 'ENDOFFILE'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DestinationsModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    AdminModule,
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class AppModule {}
ENDOFFILE

cat > src/main.ts << 'ENDOFFILE'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Tourism Platform API')
    .setDescription('API de la plateforme touristique du Burkina Faso')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log('🚀 Server running on http://localhost:3001/api');
  console.log('📚 Swagger docs at http://localhost:3001/api/docs');
}
bootstrap();
ENDOFFILE

echo "  ✔ app.module.ts"
echo "  ✔ main.ts"

echo ""
echo -e "${BLUE}📦 Étape 3/3 — Vérification des dépendances...${NC}"

if ! grep -q '"@nestjs/swagger"' package.json; then
  echo -e "${YELLOW}  ⚙️  Installation de @nestjs/swagger...${NC}"
  npm install @nestjs/swagger swagger-ui-express --silent
  echo -e "${GREEN}  ✅ @nestjs/swagger installé${NC}"
else
  echo -e "${GREEN}  ✅ @nestjs/swagger déjà présent${NC}"
fi

echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════╗"
echo "║        ✅ SETUP TERMINÉ AVEC SUCCÈS !    ║"
echo "╠══════════════════════════════════════════╣"
echo "║  26 fichiers créés                       ║"
echo "║                                          ║"
echo "║  Lance maintenant :                      ║"
echo "║  > npm run start:dev                     ║"
echo "║                                          ║"
echo "║  Puis ouvre :                            ║"
echo "║  http://localhost:3001/api/docs          ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"
