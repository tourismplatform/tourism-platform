# TourbF - Application de Tourisme au Burkina Faso

Une application Flutter moderne pour la découverte et la réservation de destinations touristiques au Burkina Faso.

## 📋 Fonctionnalités

### Pour les Touristes

#### 1. **Écran d'Accueil**
- Affichage des destinations populaires
- Catégories de destinations (Culture, Aventure, Nature)
- Cartes avec images, notes et prix
- Navigation intuitive

#### 2. **Liste des Destinations**
- Recherche par nom
- Filtrage par catégorie
- Affichage en grille ou liste
- Affichage des prix et notes

#### 3. **Détails de la Destination**
- Galerie d'images avec pagination
- Description complète
- Avis et notes des utilisateurs
- Prix par personne
- Bouton de réservation

#### 4. **Réservation**
- Sélection des dates
- Nombre de personnes
- Commentaires optionnels
- Récapitulatif du coût

#### 5. **Paiement**
- Formulaire de paiement sécurisé
- Support Stripe (intégration)
- Confirmation de réservation

#### 6. **Mes Réservations**
- Vue des réservations avec statut
- Filtrage par statut (en attente, confirmée, annulée)
- Possibilité de laisser des avis
- Système de notation 1-5 étoiles

### Pour les Administrateurs

#### 1. **Tableau de Bord**
- Statistiques clés :
  - Nombre total de réservations
  - Réservations en attente
  - Nombre de destinations
  - Nombre d'utilisateurs

#### 2. **Validation des Réservations**
- Affichage des réservations en attente
- Actions : accepter/refuser
- Détails de chaque réservation

#### 3. **Gestion des Destinations**
- Voir toutes les destinations
- Activer/désactiver une destination
- Voir le nombre de réservations
- Modifier/supprimer une destination

## 🏗️ Structure du Projet

```
lib/
├── main.dart                 # Point d'entrée principal
├── models/                   # Modèles de données
│   ├── destination.dart
│   ├── reservation.dart
│   ├── review.dart
│   ├── user.dart
│   └── index.dart
├── screens/
│   ├── user/                # Écrans touristes
│   │   ├── home_screen.dart
│   │   ├── destinations_list_screen.dart
│   │   ├── destination_detail_screen.dart
│   │   ├── reservation_screen.dart
│   │   ├── payment_screen.dart
│   │   ├── my_reservations_screen.dart
│   │   └── index.dart
│   └── admin/               # Écrans administrateur
│       ├── admin_dashboard_screen.dart
│       ├── admin_validate_reservations_screen.dart
│       ├── admin_destinations_screen.dart
│       └── index.dart
├── widgets/                 # Widgets réutilisables
│   ├── destination_card.dart
│   ├── rating_stars.dart
│   ├── category_chip.dart
│   ├── shimmer_card.dart
│   └── index.dart
├── providers/              # Gestion d'état (Provider)
│   ├── auth_provider.dart
│   ├── destination_provider.dart
│   ├── reservation_provider.dart
│   ├── review_provider.dart
│   └── index.dart
├── constants/              # Constantes et thème
│   ├── theme.dart
│   ├── constants.dart
│   └── index.dart
├── services/               # Services API
└── utils/                  # Utilitaires
```

## 🎨 Design & UX

- **Thème moderne** avec Material 3
- **Palette de couleurs** cohérente (Bleu primaire, Ambre accent)
- **Animations fluides** avec Shimmer loading
- **Widgets réutilisables** pour cohérence
- **Responsive design** pour tous les appareils

## 📦 Dépendances Principales

```yaml
dependencies:
  flutter: ^3.10.4
  provider: ^6.0.0              # Gestion d'état
  google_fonts: ^6.1.0           # Polices Google
  cached_network_image: ^3.3.0  # Images en cache
  shimmer: ^3.0.0               # Effet shimmer loading
  intl: ^0.19.0                 # Internationalisation
  flutter_stripe: ^9.0.0        # Paiements Stripe
  google_maps_flutter: ^2.5.0   # Cartes
  geolocator: ^9.0.0            # Géolocalisation
```

## 🚀 Guide de Démarrage

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd projet_tourbf
```

2. **Installer les dépendances**
```bash
flutter pub get
```

3. **Lancer l'application**
```bash
flutter run
```

### Configuration

#### Stripe (Paiements)
1. Créer un compte Stripe
2. Copier les clés API
3. Configurer dans le fichier `payment_screen.dart`

#### Google Maps
1. Activer Google Maps API
2. Ajouter les clés API dans les fichiers de configuration Android/iOS

#### Backend API
- Remplacer `apiBaseUrl` dans `constants.dart` par votre URL
- Implémenter les appels API réels dans les providers

## 🔐 Authentification

Le projet utilise actuellement une authentification simulée. Pour la production :

1. Implémenter Firebase Authentication ou autre service
2. Ajouter le stockage sécurisé des tokens
3. Gérer la session utilisateur

## 💾 Stockage des Données

- **SharedPreferences** : Préférences utilisateur
- **Firebase/Backend** : Données principales (destinations, réservations)
- **Base de données locale** : Cache optionnel avec SQLite

## 🧪 Tests

```bash
# Tests unitaires
flutter test

# Tests d'intégration
flutter test integration_test/
```

## 📝 Convention de Code

- **Nommage** : camelCase pour les variables, PascalCase pour les classes
- **Widgets** : StatelessWidget par défaut, StatefulWidget si état nécessaire
- **Commentaires** : Documenter les fonctions publiques
- **Formatage** : `flutter format lib/`
- **Analyse** : `flutter analyze`

## 🐛 Gestion des Erreurs

- Affichage de messages d'erreur aux utilisateurs
- Logs pour le débogage
- SnackBars pour les notifications
- Dialogues pour les confirmations

## 📱 Compatibilité

- **Android** : API 21+
- **iOS** : 11.0+
- **Web** : Support partiel

## 🌐 Internationalisation

Le projet est prêt pour la traduction :
- Utiliser `intl` package
- Créer des fichiers `.arb` pour chaque langue
- Localiser les textes dans les widgets

## 🚀 Déploiement

### Android
```bash
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
flutter build ipa --release
```

### Web
```bash
flutter build web --release
```

## 📞 Support et Contribution

Pour signaler des bugs ou contribuer :
1. Créer une issue
2. Forker le projet
3. Créer une branche feature
4. Soumettre une pull request

## 📄 License

Ce projet est licencié sous MIT License.

## 👨‍💻 Auteur

Développé pour TourbF - Application de Tourisme au Burkina Faso

---

**Dernière mise à jour** : Mars 2026
