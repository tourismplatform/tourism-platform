import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryEnum {
  NATURE = 'NATURE',
  HISTORY = 'HISTORY',
  BEACH = 'BEACH',
  CIRCUIT = 'CIRCUIT',
}

export class CreateDestinationDto {
  @ApiProperty({ example: 'Cascades de Banfora' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Magnifiques cascades situées à Banfora' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty({ example: 'Banfora, Burkina Faso' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  price_per_person: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  capacity: number;
}
