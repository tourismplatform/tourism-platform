import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private supabase: SupabaseService) {}

  // ─── Vérification disponibilité ───────────────────────────────────
  private async checkAvailability(
    destinationId: string,
    checkIn: string,
    checkOut: string,
    nbPersons: number,
  ) {
    const client = this.supabase.getClient();

    const { data: dest } = await client
      .from('destinations')
      .select('capacity')
      .eq('id', destinationId)
      .single();

    if (!dest) throw new NotFoundException('Destination non trouvée');

    const { data: bookings } = await client
      .from('bookings')
      .select('nb_persons')
      .eq('destination_id', destinationId)
      .eq('status', 'CONFIRMED')
      .lte('check_in', checkOut)
      .gte('check_out', checkIn);

    const totalPersons = (bookings || []).reduce(
      (sum, b) => sum + (b.nb_persons as number),
      0,
    );

    if (totalPersons + nbPersons > (dest.capacity as number)) {
      throw new BadRequestException('Destination complète pour ces dates');
    }
  }

  // ─── Créer une réservation ─────────────────────────────────────────
  async create(dto: CreateBookingDto, userId: string) {
    await this.checkAvailability(
      dto.destination_id,
      dto.check_in,
      dto.check_out,
      dto.nb_persons,
    );

    const client = this.supabase.getClient();

    const { data: dest } = await client
      .from('destinations')
      .select('price_per_person')
      .eq('id', dto.destination_id)
      .single();

    if (!dest) throw new NotFoundException('Destination non trouvée');

    const checkIn = new Date(dto.check_in);
    const checkOut = new Date(dto.check_out);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice =
      (dest.price_per_person as number) * dto.nb_persons * (nights || 1);

    console.log(`[Booking] Création réservation pour utilisateur ${userId}, statut initial: PENDING`);
    const { data, error } = await client
      .from('bookings')
      .insert({
        ...dto,
        user_id: userId,
        status: 'PENDING',
        total_price: totalPrice,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Réservation créée avec succès' };
  }

  // ─── Mes réservations ──────────────────────────────────────────────
  async findMyBookings(userId: string) {
  const client = this.supabase.getClient();
  const { data, error } = await client
    .from('bookings')
    .select('*, destinations(name, location, category)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Auto-complétion si check_out dépassé
  const now = new Date();
  for (const booking of data || []) {
    if (booking.status === 'CONFIRMED' && new Date(booking.check_out) < now) {
      await client
        .from('bookings')
        .update({ status: 'COMPLETED' })
        .eq('id', booking.id);
      booking.status = 'COMPLETED';
    }
  }

  return { data, message: 'Mes réservations récupérées' };
}

  // ─── Détail d'une réservation ──────────────────────────────────────
  async findOne(id: string, userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings')
      .select('*, destinations(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Réservation non trouvée');
    return { data, message: 'Réservation récupérée' };
  }

  // ─── Admin : toutes les réservations ──────────────────────────────
  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings')
      .select('*, destinations(name), users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Toutes les réservations récupérées' };
  }

  async updateStatus(
    id: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ) {
    console.log(`[Admin] Mise à jour réservation ${id} vers ${status}`);
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[Admin] Erreur mise à jour statut:`, error);
      throw new Error(error.message);
    }
    
    console.log(`[Admin] Succès mise à jour ${id}`);
    return { data, message: `Réservation ${status.toLowerCase()}` };
  }
}