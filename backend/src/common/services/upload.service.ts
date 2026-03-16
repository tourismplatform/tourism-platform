import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase.service';

@Injectable()
export class UploadService {
  constructor(private supabase: SupabaseService) {}

  async uploadAvatar(file: Buffer, filename: string, mimeType: string): Promise<string> {
    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException('Type de fichier non autorisé. Seuls les images sont acceptées.');
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.length > maxSize) {
      throw new BadRequestException('Fichier trop volumineux. Taille maximale: 5MB.');
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const uniqueFilename = `avatars/${timestamp}-${filename}`;

    // Upload vers Supabase Storage
    const client = this.supabase.getClient();
    const { data, error } = await client.storage
      .from('avatars')
      .upload(uniqueFilename, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException(`Erreur lors de l'upload: ${error.message}`);
    }

    // Récupérer l'URL publique
    const { data: publicUrlData } = client.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }

  async deleteAvatar(url: string): Promise<void> {
    // Extraire le chemin du fichier de l'URL
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const filePath = `avatars/${filename}`;

    const client = this.supabase.getClient();
    const { error } = await client.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`Erreur lors de la suppression: ${error.message}`);
    }
  }
}
