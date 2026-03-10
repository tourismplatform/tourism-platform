import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ example: 'uuid-du-booking' })
  @IsNotEmpty()
  @IsString()
  booking_id: string;
}
