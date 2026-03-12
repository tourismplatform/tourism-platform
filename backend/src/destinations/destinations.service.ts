import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

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
    const { images, ...destData } = dto;

    const { data: dest, error: destError } = await client
      .from('destinations')
      .insert({ ...destData, status: 'PUBLISHED', created_by: adminId })
      .select()
      .single();

    if (destError) throw new Error(destError.message);

    // Si on a des images, les insérer
    if (images && images.length > 0) {
      const imageInserts = images.map(url => ({
        destination_id: dest.id,
        url: url,
        uploaded_by: adminId,
        is_cover: false
      }));
      await client.from('destination_images').insert(imageInserts);
    }

    return { data: dest, message: 'Destination créée' };
  }

  async update(id: string, dto: UpdateDestinationDto) {
    const client = this.supabase.getClient();
    const { images, ...destData } = dto;

    const { data, error } = await client
      .from('destinations')
      .update(destData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Gestion simple des images lors de l'update : on peut ajouter de nouvelles images 
    // ou tout remplacer selon le besoin. Ici, on va juste mettre à jour les infos de base.
    // L'ajout d'image spécifique utilise déjà addImage().
    
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

  async addImage(destinationId: string, imageUrl: string, isCover: boolean, adminId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('destination_images')
      .insert({
        destination_id: destinationId,
        url: imageUrl,
        is_cover: isCover,
        uploaded_by: adminId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Image ajoutée' };
  }
}
