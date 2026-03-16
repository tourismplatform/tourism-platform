import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadService } from '../common/services/upload.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tourism_secret_2026',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, JwtAuthGuard, UploadService],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
