# 🌍 Tourism Platform — Burkina Faso

Plateforme touristique complète pour la découverte et la réservation de destinations au Burkina Faso.

## Architecture

```
tourism-platform/
├── backend/              ← API REST NestJS    (port 3001)
├── frontend-touriste/    ← App client Next.js (port 3000)
└── frontend-admin/       ← Dashboard admin    (port 3002)
```

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **npm** v9+
- Un compte **Supabase** → [supabase.com](https://supabase.com) *(demandez les clés à l'équipe)*

---

## 📥 Cloner le projet

```bash
git clone https://github.com/<votre-org>/tourism-platform.git
cd tourism-platform
```

---

## ⚙️ 1. Backend (API NestJS)

### Installation

```bash
cd backend
npm install
```

### Configuration de l'environnement

Copiez le fichier d'exemple et remplissez les valeurs :

```bash
cp .env.example .env
```

Ouvrez `.env` et renseignez :

```env
# Supabase — demandez ces valeurs à l'équipe
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=votre_anon_key_supabase

# JWT — utilisez la même clé que les autres membres de l'équipe
JWT_SECRET=tourism_platform_secret_2026
JWT_EXPIRES_IN=24h

# Serveur
PORT=3001
NODE_ENV=development
```

> 💡 **SUPABASE_URL** et **SUPABASE_KEY** se trouvent dans votre projet Supabase → *Settings > API*

### Lancer le serveur

```bash
# Mode développement (rechargement auto)
npm run start:dev
```

✅ API disponible sur : **http://localhost:3001/api**  
📚 Documentation Swagger : **http://localhost:3001/api/docs**

---

## 🌐 2. Frontend Touriste (App Client)

### Installation

```bash
cd frontend-touriste
npm install
```

### Configuration de l'environnement

```bash
cp .env.local.example .env.local
```

Si le fichier `.env.local.example` n'existe pas, créez manuellement `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Lancer l'app

```bash
npm run dev
```

✅ App disponible sur : **http://localhost:3000**

---

## 🛠️ 3. Frontend Admin (Dashboard)

### Installation

```bash
cd frontend-admin
npm install
```

### Configuration de l'environnement

Créez le fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Lancer l'app

```bash
npm run dev
```

✅ Dashboard disponible sur : **http://localhost:3002**

---

## 🚀 Démarrage complet (3 terminaux)

Ouvrez **3 terminaux** et lancez dans l'ordre :

```bash
# Terminal 1 — Backend
cd backend && npm run start:dev

# Terminal 2 — Frontend Touriste
cd frontend-touriste && npm run dev

# Terminal 3 — Frontend Admin
cd frontend-admin && npm run dev
```

---

## 🧪 Tester l'application

### Créer un compte touriste

1. Aller sur **http://localhost:3000/register**
2. Remplir le formulaire et créer un compte
3. Se connecter sur **http://localhost:3000/login**

### Accéder au dashboard admin

Pour tester les fonctionnalités admin, votre compte doit avoir le rôle `ADMIN`.  
Exécutez cette requête SQL dans Supabase (Table Editor ou SQL Editor) :

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

Ensuite, reconnectez-vous et ouvrez **http://localhost:3002**.

### Explorer la documentation API

La documentation complète Swagger est disponible à :
**http://localhost:3001/api/docs**

Cliquez sur **Authorize** et collez votre token JWT (obtenu après login) pour tester les endpoints protégés.

---

## 📌 Ports utilisés

| Service | Port | URL |
|---|---|---|
| API Backend | 3001 | http://localhost:3001/api |
| Swagger Docs | 3001 | http://localhost:3001/api/docs |
| Frontend Touriste | 3000 | http://localhost:3000 |
| Frontend Admin | 3002 | http://localhost:3002 |

---

## 📂 Structure des modules Backend

| Module | Endpoints principaux |
|---|---|
| **Auth** | Inscription, connexion, profil |
| **Destinations** | Liste, détail, CRUD admin, upload images |
| **Bookings** | Créer réservation, mes réservations, gestion admin |
| **Payments** | Paiement mock (XOF/FCFA), remboursement |
| **Reviews** | Avis (après séjour complété), modération admin |
| **Admin** | Statistiques, gestion utilisateurs, rôles |

---

## 🛑 Problèmes fréquents

**`CORS error` dans le navigateur**  
→ Vérifiez que le backend tourne bien sur le port **3001**.

**`401 Unauthorized` sur les requêtes**  
→ Votre token JWT a expiré (durée : 24h). Reconnectez-vous.

**Page admin inaccessible**  
→ Votre compte n'a pas le rôle `ADMIN`. Voir la section "Accéder au dashboard admin" ci-dessus.

**`Cannot find module` ou erreurs de démarrage**  
→ Relancez `npm install` dans le dossier concerné.

---

## 👥 Équipe

Projet développé dans le cadre du tourisme numérique au Burkina Faso.  
Pour toute question, contactez le lead technique de l'équipe.