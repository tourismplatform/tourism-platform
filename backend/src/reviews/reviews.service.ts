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
      .from('reviews').select('*, users(name, email)')
      .eq('destination_id', destinationId).eq('status', 'VISIBLE')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Avis récupérés' };
  }

  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('reviews').select('*, users(name, email), destinations(name)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Tous les avis récupérés' };
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
