import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Marc Touriste', description: "Nom complet de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'marc@example.com', description: 'Adresse email unique' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mot de passe (min 6 caractères)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: '+226 00 00 00 00', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
