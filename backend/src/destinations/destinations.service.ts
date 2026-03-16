import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private supabase: SupabaseService) {}

  private _transformDestination(dest: any) {
    if (!dest) return null;
    const { destination_images, ...rest } = dest;
    return {
      ...rest,
      images: destination_images?.map(img => img.url) || []
    };
  }

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

    const transformed = data.map(dest => this._transformDestination(dest));
    return { data: transformed, message: 'Destinations récupérées' };
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('destinations')
      .select('*, destination_images(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Destination non trouvée');
    return { data: this._transformDestination(data), message: 'Destination récupérée' };
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
      console.log(`[Create] Insertion de ${images.length} images pour la destination ${dest.id}`);
      const imageInserts = images.map(url => ({
        destination_id: dest.id,
        url: url,
        is_cover: false
      }));
      
      const { error: imgError } = await client.from('destination_images').insert(imageInserts);
      if (imgError) {
        console.error('[Create] Erreur insertion images:', imgError);
        // On ne bloque pas forcément la création de la destination si les images échouent, 
        // mais ici on veut savoir pourquoi ça échoue.
        throw new Error(`Erreur images: ${imgError.message}`);
      }
    }

    return this.findOne(dest.id);
  }

  async update(id: string, dto: UpdateDestinationDto, adminId: string) {
    const client = this.supabase.getClient();
    const { images, ...destData } = dto;

    const { error } = await client
      .from('destinations')
      .update(destData)
      .eq('id', id);

    if (error) throw new Error(error.message);

    // Synchronisation des images
    if (images) {
      const { data: existingImages } = await client
        .from('destination_images')
        .select('url')
        .eq('destination_id', id);
      
      const existingUrls = existingImages?.map(img => img.url) || [];
      const newImages = images.filter(url => !existingUrls.includes(url));

      if (newImages.length > 0) {
        console.log(`[Update] Insertion de ${newImages.length} nouvelles images pour ${id}`);
        const imageInserts = newImages.map(url => ({
          destination_id: id,
          url: url,
          is_cover: false
        }));
        const { error: imgError } = await client.from('destination_images').insert(imageInserts);
        if (imgError) {
          console.error('[Update] Erreur insertion images:', imgError);
          throw new Error(`Erreur images: ${imgError.message}`);
        }
      }
    }
    
    return this.findOne(id);
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
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Image ajoutée' };
  }
}
