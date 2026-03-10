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
