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
