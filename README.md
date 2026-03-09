# 🌍 Tourism Platform — Backend API

API REST du projet **Tourism Promotion Platform** développée avec NestJS et Supabase.

---

## 📋 Description

Backend de la plateforme touristique permettant de :
- Gérer les destinations touristiques
- Effectuer des réservations avec paiement simulé
- Laisser des avis sur les destinations
- Administrer la plateforme via un dashboard

---

## 👥 Équipe

| Nom | Rôle | Branche |
|---|---|---|
| NANA Marc | Chef de projet + Backend | `feature/auth` |
| NITIEMA Eddy | Backend | `feature/api` |
| OUEDRAOGO Alimata | Frontend Web Touriste | `feature/web-touriste` |
| ILBOUDO Balkissa | Frontend Web Admin | `feature/web-admin` |
| OUEDRAOGO Corneille | Mobile Flutter | `feature/flutter` |

---

## 🛠️ Stack technique

- **Framework** : NestJS (Node.js + TypeScript)
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : JWT
- **Validation** : class-validator
- **Paiement** : Mock (simulé)

---

## 🚀 Installation et lancement

### Prérequis
- Node.js v18+
- npm v9+
- Un compte Supabase

### 1. Cloner le repo
```bash
git clone https://github.com/NANA-MARC/tourism-platform.git
cd tourism-platform/backend
```

### 2. Aller sur sa branche
```bash
# Eddy
git checkout feature/api

# Marc
git checkout feature/auth
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Configurer les variables d'environnement
```bash
cp .env.example .env
nano .env
```

Remplis les valeurs :
```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_KEY=sb_publishable_xxxxxxxxxxxx
JWT_SECRET=tourism_platform_secret_2026
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
```

### 5. Lancer le serveur
```bash
npm run start
```

Le serveur tourne sur : `http://localhost:3001/api`

---

## 📡 Endpoints disponibles

### Auth
| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Inscription |
| POST | `/api/auth/login` | Public | Connexion |
| GET | `/api/auth/me` | Auth | Profil connecté |

### Destinations (Eddy)
| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/api/destinations` | Public | Liste avec filtres |
| GET | `/api/destinations/:id` | Public | Détail |
| POST | `/api/admin/destinations` | Admin | Créer |
| PUT | `/api/admin/destinations/:id` | Admin | Modifier |
| DELETE | `/api/admin/destinations/:id` | Admin | Supprimer |

### Bookings (Eddy)
| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/api/bookings` | Auth | Créer une réservation |
| GET | `/api/bookings/my` | Auth | Mes réservations |
| GET | `/api/admin/bookings` | Admin | Toutes les réservations |
| PUT | `/api/admin/bookings/:id` | Admin | Confirmer/Annuler |

### Payments (Eddy)
| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/api/payments/process` | Auth | Paiement simulé |
| GET | `/api/payments/:bookingId` | Auth | Statut paiement |

### Reviews (Eddy)
| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/api/reviews` | Auth | Laisser un avis |
| GET | `/api/reviews/:destId` | Public | Avis d'une destination |
| DELETE | `/api/admin/reviews/:id` | Admin | Supprimer un avis |

### Admin
| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Statistiques globales |
| GET | `/api/admin/users` | Admin | Liste utilisateurs |

---

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

Le token est obtenu après login ou register.

**Rôles disponibles :**
- `TOURIST` — attribué automatiquement à l'inscription
- `ADMIN` — attribué manuellement via Supabase

---

## 📦 Format des réponses

### Succès
```json
{
  "data": { ... },
  "message": "Description du succès"
}
```

### Erreur
```json
{
  "error": "Description de l'erreur",
  "statusCode": 400
}
```

---

## 🗄️ Structure de la base de données

```
users               → Utilisateurs (TOURIST / ADMIN)
destinations        → Destinations touristiques
destination_images  → Photos des destinations
bookings            → Réservations
payments            → Paiements simulés
reviews             → Avis des touristes
```

---

## 📁 Structure du projet

```
backend/
└── src/
    ├── auth/               ← Marc (register, login, JWT)
    │   ├── dto/
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── auth.module.ts
    ├── destinations/       ← Eddy
    ├── bookings/           ← Eddy
    ├── payments/           ← Eddy
    ├── reviews/            ← Eddy
    ├── common/
    │   ├── guards/         ← JwtAuthGuard
    │   ├── decorators/
    │   └── filters/
    ├── supabase.service.ts
    ├── app.module.ts
    └── main.ts
```

---

## 🌿 Règles Git

```
main          → Code final livrable (Marc valide)
develop       → Intégration quotidienne
feature/auth  → Marc
feature/api   → Eddy
```

**Convention de commits :**
```
feat:   Nouvelle fonctionnalité
fix:    Correction de bug
style:  Modification visuelle
docs:   Documentation
chore:  Configuration/setup
```

**Exemple :**
```bash
git commit -m "feat: ajouter CRUD destinations"
```

---

## ⚠️ Règles importantes

- Ne jamais commiter le fichier `.env`
- Ne jamais pusher directement sur `main`
- Toute modification du Contrat API → informer toute l'équipe
- Commit au moins 1 fois par demi-journée
- Bloqué plus de 1h → message direct à Marc

---

## 🧪 Tester l'API

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Test User", "email": "test@test.com", "password": "Test2026"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@test.com", "password": "Test2026"}'
```

### GetMe (avec token)
```bash
curl http://localhost:3001/api/auth/me \
-H "Authorization: Bearer <ton_token>"
```

---

*Document maintenu par NANA Marc — Chef de projet*  
*Mars 2026*
