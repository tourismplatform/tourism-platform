import { Controller, Post, Get, Put, Body, Request, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadService } from '../common/services/upload.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Inscription' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Connexion' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Mon profil' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req) {
    return this.authService.getMe(req.user.userId);
  }

  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  @ApiBearerAuth()
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Uploader un avatar' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const avatarUrl = await this.uploadService.uploadAvatar(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    // Mettre à jour l'utilisateur avec la nouvelle URL d'avatar
    return this.authService.updateProfile(req.user.userId, { avatar: avatarUrl });
  }
}
