import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDestinationDto {
  @ApiPropertyOptional({ example: 'NATURE' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;
}
