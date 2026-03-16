import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Jean Dupont', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '+226 70 00 00 00', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-]{8,15}$/, { message: 'Format de téléphone invalide' })
  phone?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'oldPassword123', required: false })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({ example: 'newPassword123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  newPassword?: string;
}
