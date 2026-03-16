import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BookingsController],
  providers: [BookingsService, SupabaseService],
  exports: [BookingsService],
})
export class BookingsModule {}
