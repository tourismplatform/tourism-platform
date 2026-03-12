# Backend — Tourism Platform API

API REST construite avec [NestJS](https://nestjs.com) pour la plateforme touristique du Burkina Faso.

## Stack

- **NestJS** v11 + TypeScript
- **Supabase** (PostgreSQL + Storage)
- **Passport JWT** pour l'authentification
- **Swagger** pour la documentation auto

## Installation

```bash
npm install
```

## Configuration

```bash
cp .env.example .env
```

Renseignez vos variables dans `.env` :

| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL de votre projet Supabase |
| `SUPABASE_KEY` | Clé anon publique Supabase |
| `JWT_SECRET` | Clé secrète JWT (partagée avec l'équipe) |
| `JWT_EXPIRES_IN` | Durée de validité du token (ex: `24h`) |
| `PORT` | Port du serveur (défaut: `3001`) |

## Démarrer

```bash
# Développement (watch mode)
npm run start:dev

# Production
npm run start:prod
```

## Documentation API

Swagger disponible sur : **http://localhost:3001/api/docs**

## Endpoints principaux

| Module | Route | Méthode | Auth |
|---|---|---|---|
| Auth | `/api/auth/register` | POST | Non |
| Auth | `/api/auth/login` | POST | Non |
| Auth | `/api/auth/me` | GET | JWT |
| Destinations | `/api/destinations` | GET | Non |
| Destinations | `/api/admin/destinations` | POST | ADMIN |
| Bookings | `/api/bookings` | POST | JWT |
| Bookings | `/api/bookings/my` | GET | JWT |
| Bookings | `/api/admin/bookings` | GET | ADMIN |
| Payments | `/api/payments/:bookingId` | POST | JWT |
| Reviews | `/api/reviews` | POST | JWT |
| Admin | `/api/admin/stats` | GET | ADMIN |

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## Promouvoir un compte en ADMIN

Exécutez dans le SQL Editor Supabase :

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

Puis reconnectez-vous pour que le nouveau token JWT reflète le rôle.
