import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private supabase: SupabaseService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const client = this.supabase.getClient();

    // Vérifier si email existe déjà
    const { data: existing } = await client
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Créer l'utilisateur
    const { data: user, error } = await client
      .from('users')
      .insert({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: 'TOURIST',
      })
      .select('id, name, email, role, created_at')
      .single();

    if (error) throw new ConflictException(error.message);

    // Générer le token JWT
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      data: { token, user },
      message: 'Inscription réussie',
    };
  }

  async login(dto: LoginDto) {
    const client = this.supabase.getClient();

    // Chercher l'utilisateur
    const { data: user } = await client
      .from('users')
      .select('*')
      .eq('email', dto.email)
      .single();

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      data: { token, user: userWithoutPassword },
      message: 'Connexion réussie',
    };
  }

  async getMe(userId: string) {
    const client = this.supabase.getClient();

    const { data: user, error } = await client
      .from('users')
      .select('id, name, email, role, avatar, phone, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return {
      data: user,
      message: 'Profil récupéré',
    };
  }
}
