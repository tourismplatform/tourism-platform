import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private supabase;
    private jwtService;
    constructor(supabase: SupabaseService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        data: {
            token: string;
            user: {
                id: any;
                name: any;
                email: any;
                role: any;
                created_at: any;
            };
        };
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        data: {
            token: string;
            user: any;
        };
        message: string;
    }>;
    getMe(userId: string): Promise<{
        data: {
            id: any;
            name: any;
            email: any;
            role: any;
            avatar: any;
            phone: any;
            created_at: any;
        };
        message: string;
    }>;
}
