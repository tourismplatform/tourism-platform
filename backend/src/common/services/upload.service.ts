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

    // Générer un nom de fichier unique et nettoyer le nom (enlever espaces et caractères spéciaux)
    const timestamp = Date.now();
    const sanitizedName = filename.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const uniqueFilename = `avatars/${timestamp}-${sanitizedName}`;

    // Upload vers Supabase Storage
    const client = this.supabase.getClient();
    const { data, error } = await client.storage
      .from('avatars')
      .upload(uniqueFilename, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      let errorMessage = error.message;
      if (errorMessage.includes('Bucket not found')) {
        errorMessage = "Le dossier de stockage 'avatars' n'existe pas dans Supabase. Veuillez le créer dans votre tableau de bord Supabase (Storage > New Bucket).";
      } else if (errorMessage.includes('row-level security policy')) {
        errorMessage = "Politique de sécurité RLS manquante. Veuillez autoriser l'insertion (INSERT) et la lecture (SELECT) dans le bucket 'avatars' via votre tableau de bord Supabase (Storage > Policies).";
      }
      throw new BadRequestException(`Erreur lors de l'upload: ${errorMessage}`);
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
