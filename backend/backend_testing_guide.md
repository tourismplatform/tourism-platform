# Guide de Test Backend : Tourism-Platform

Ce guide permet de configurer et de tester le backend de manière exhaustive sans interface graphique.

## 1. Schéma de Base de Données (Supabase)

Exécute ce script SQL dans l'éditeur SQL de ton dashboard Supabase pour créer les tables nécessaires.

```sql
-- 1. Table des Utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'TOURIST', -- 'TOURIST' or 'ADMIN'
  avatar VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Destinations
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL, -- NATURE / HISTORY / BEACH / CIRCUIT
  location VARCHAR NOT NULL,
  price_per_person NUMERIC NOT NULL,
  capacity INT4 NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'DRAFT', -- DRAFT / PUBLISHED / SUSPENDED / DELETED
  avg_rating NUMERIC DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des Images de Destinations
CREATE TABLE destination_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id),
  url VARCHAR NOT NULL,
  is_cover BOOL NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des Réservations
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  destination_id UUID REFERENCES destinations(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nb_persons INT4 NOT NULL,
  total_price NUMERIC NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'PENDING', -- PENDING / CONFIRMED / CANCELLED / COMPLETED
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table des Paiements
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  amount NUMERIC NOT NULL,
  currency VARCHAR NOT NULL DEFAULT 'XOF',
  method VARCHAR NOT NULL DEFAULT 'MOCK',
  status VARCHAR NOT NULL DEFAULT 'PENDING', -- PENDING / SUCCESS / FAILED / REFUNDED
  transaction_id VARCHAR UNIQUE, -- MOCK_TXN_XXXX
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table des Avis (Reviews)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  destination_id UUID NOT NULL REFERENCES destinations(id),
  booking_id UUID NOT NULL REFERENCES bookings(id), -- Doit être COMPLETED
  rating INT4 NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR NOT NULL DEFAULT 'VISIBLE', -- VISIBLE / HIDDEN
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Accès à la Documentation API

Une fois le serveur démarré (`npm run start:dev`), accède à l'interface Swagger pour tester les endpoints interactivement :
👉 [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 3. Séquence de Test Recommandée

### Étape 1 : Authentification
1. **Inscription** : `POST /api/auth/register`
   - Payload: `{ "name": "Test User", "email": "test@example.com", "password": "password123" }`
2. **Connexion** : `POST /api/auth/login`
   - Récupère le `token` dans la réponse.
3. **Configuration Swagger** : Clique sur "Authorize" en haut à droite et colle le token.

### Étape 2 : Gestion des Destinations (Rôle ADMIN nécessaire)
1. **Création** : `POST /api/admin/destinations`
   - *Note : Tu dois manuellement changer ton rôle en 'ADMIN' dans la table `users` de Supabase pour cette étape.*
2. **Upload d'image** : `POST /api/admin/destinations/{id}/images`
3. **Publication** : Assure-toi que le `status` est mis à `PUBLISHED` (via `PUT`).

### Étape 3 : Flux Voyageur
1. **Lister** : `GET /api/destinations` (Vérifie si ta destination apparaît).
2. **Réserver** : `POST /api/bookings`
   - Le système calculera automatiquement le prix total et vérifiera la capacité.
3. **Payer (Simulé)** : `POST /api/payments/mock-pay`
   - Payload: `{ "bookingId": "..." }`
   - Cela passera la réservation en `CONFIRMED`.

### Étape 4 : Avis et Retours
1. **Terminer un voyage** : Change manuellement le statut de la réservation en `COMPLETED` (via Admin API ou DB).
2. **Laisser un avis** : `POST /api/reviews`
   - Le système mettra à jour la note moyenne (`avg_rating`) de la destination.

---

## 4. Points de Vigilance pour ton Équipe

- **DTOs** : Toutes les entrées sont validées. Si une requête échoue avec une erreur 400, vérifie les formats (ex: ISO pour les dates).
- **CORS** : Si vous testez depuis un autre domaine, pensez à mettre à jour `main.ts`.
- **Supabase Key** : Utilisez toujours `SUPABASE_KEY` (anon key) pour le `SupabaseService`.
