import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class PaymentsService {
  constructor(private supabase: SupabaseService) {}

  async processMockPayment(bookingId: string, userId: string) {
    const client = this.supabase.getClient();

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const transactionId = `MOCK_TXN_${Math.random().toString(36).substring(7).toUpperCase()}`;

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
    
    // NOTE: Manual confirmation by Admin is now required. 
    // We don't update status to CONFIRMED here anymore.

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
