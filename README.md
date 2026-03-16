# TourbF - Application de Tourisme au Burkina Faso

Application Flutter complète pour la découverte et la réservation de destinations touristiques au Burkina Faso.

## 🎯 Vue d'ensemble

TourbF est une plateforme mobile qui connecte les touristes aux destinations les plus attrayantes du Burkina Faso. L'application offre une expérience seamless pour découvrir, réserver et profiter de destinations uniques.

### Principales Fonctionnalités

**Pour les Touristes:**
- 🏠 Accueil avec destinations populaires
- 🔍 Recherche et filtrage avancés
- 📖 Détails complets des destinations
- 📅 Système de réservation flexible
- 💳 Paiement sécurisé (Stripe)
- ⭐ Système d'avis et de notation
- 📱 Gestion des réservations en un clic

**Pour les Administrateurs:**
- 📊 Tableau de bord avec statistiques
- ✅ Validation des réservations
- 🗺️ Gestion des destinations
- 📈 Suivi des performances

## 📦 Installation

### Prérequis
- Flutter 3.10+
- Dart 3.0+
- Android Studio / Xcode

### Étapes

```bash
# Cloner le projet
git clone <repository-url>
cd projet_tourbf

# Installer les dépendances
flutter pub get

# Lancer l'application
flutter run
```

## 🏗️ Architecture

```
lib/
├── main.dart              # Point d'entrée
├── models/                # Modèles de données
├── screens/               # Écrans UI
│   ├── user/             # Écrans touristes
│   └── admin/            # Écrans admin
├── widgets/              # Widgets réutilisables
├── providers/            # Gestion d'état
├── constants/            # Thème et constantes
├── services/             # Services API
└── utils/                # Utilitaires
```

## 🎨 Caractéristiques

- ✨ Design moderne avec Material Design 3
- 🎬 Animations fluides et transitions
- 📐 Layout responsive
- 🌙 Support du mode sombre (prêt)
- 🌐 Prêt pour l'internationalisation
- ⚡ Optimisé pour les performances

## 🚀 Déploiement

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ipa --release
```

### Web
```bash
flutter build web --release
```

## 📚 Documentation

- [Guide Complet](GUIDE_COMPLET.md) - Documentation détaillée
- [Configuration](CONFIG.md) - Guide de configuration
- [Extension](EXTENSION_GUIDE.md) - Comment étendre l'app

## 🛠️ Dépendances Principales

```yaml
provider: ^6.0.0                  # Gestion d'état
google_fonts: ^6.1.0              # Polices Google
cached_network_image: ^3.3.0     # Images
shimmer: ^3.0.0                   # Loading animations
intl: ^0.19.0                     # Internationalisation
flutter_stripe: ^9.0.0            # Paiements
google_maps_flutter: ^2.5.0       # Cartes
```

## 🔑 Configuration

### API Backend
Remplacer `apiBaseUrl` dans `lib/constants/constants.dart`:

```dart
const String apiBaseUrl = 'https://api.tourismburkina.com';
```

### Stripe
Ajouter vos clés dans `lib/screens/user/payment_screen.dart`

### Google Maps
Configurer les clés API pour Android et iOS

## 📱 Compatibilité

- Android 5.0+ (API 21)
- iOS 11.0+
- Web (support partiel)

## 🧪 Tests

```bash
# Tests unitaires
flutter test

# Vérifier la qualité du code
flutter analyze

# Formater le code
flutter format lib/
```

## 📈 Structure des Screens

### User Flow
1. **RoleSelectionScreen** → Sélection du rôle
2. **MainUserScreen** → Navigation principale
   - HomeScreen → Accueil avec catégories
   - DestinationsListScreen → Liste complète
   - MyReservationsScreen → Mes réservations
   - ProfileScreen → Profil utilisateur

### Admin Flow
1. **AdminDashboardScreen** → Tableau de bord
2. **AdminValidateReservationsScreen** → Validation
3. **AdminDestinationsScreen** → Gestion des destinations

## 🤝 Contribution

Les contributions sont bienvenues! Veuillez:
1. Forker le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Développé pour TourbF - Application de Tourisme au Burkina Faso

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

---

**Version:** 1.0.0  
**Dernière mise à jour:** Mars 2026  
**Status:** En production

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
