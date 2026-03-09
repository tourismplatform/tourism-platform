import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getMe(req: any): Promise<{
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
