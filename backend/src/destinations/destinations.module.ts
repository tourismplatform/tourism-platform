import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { SupabaseService } from '../supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DestinationsController],
  providers: [DestinationsService, SupabaseService],
  exports: [DestinationsService],
})
export class DestinationsModule {}
