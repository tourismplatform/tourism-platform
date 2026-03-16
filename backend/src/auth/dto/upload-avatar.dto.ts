import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarDto {
  @ApiProperty({ 
    type: 'string',
    format: 'binary',
    description: 'Fichier image (JPEG, PNG, WebP, GIF) - Max 5MB'
  })
  file: any;
}
