import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-de-la-destination' })
  @IsNotEmpty()
  @IsString()
  destination_id: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  check_in: string;

  @ApiProperty({ example: '2026-04-05' })
  @IsDateString()
  check_out: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  nb_persons: number;

  @ApiPropertyOptional({ example: 'Famille avec enfants' })
  @IsOptional()
  @IsString()
  message?: string;
}
