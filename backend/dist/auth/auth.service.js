"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const supabase_service_1 = require("../supabase.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    supabase;
    jwtService;
    constructor(supabase, jwtService) {
        this.supabase = supabase;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const client = this.supabase.getClient();
        const { data: existing } = await client
            .from('users')
            .select('id')
            .eq('email', dto.email)
            .single();
        if (existing) {
            throw new common_1.ConflictException('Cet email est déjà utilisé');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
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
        if (error)
            throw new common_1.ConflictException(error.message);
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
    async login(dto) {
        const client = this.supabase.getClient();
        const { data: user } = await client
            .from('users')
            .select('*')
            .eq('email', dto.email)
            .single();
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
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
    async getMe(userId) {
        const client = this.supabase.getClient();
        const { data: user, error } = await client
            .from('users')
            .select('id, name, email, role, avatar, phone, created_at')
            .eq('id', userId)
            .single();
        if (error || !user) {
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        }
        return {
            data: user,
            message: 'Profil récupéré',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map