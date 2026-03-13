# 🚀 Démarrage Rapide - TourbF

Guide pour démarrer rapidement avec l'application TourbF.

## ⚡ 5 Minutes Setup

### 1. Prérequis
- ✅ Flutter installé (`flutter --version`)
- ✅ Android Studio / Xcode
- ✅ Git

### 2. Clone & Install

```bash
# Cloner le projet
git clone <repository-url> projet_tourbf
cd projet_tourbf

# Installer les dépendances
flutter pub get

# (Optionnel) Nettoyer le cache
flutter clean
flutter pub get
```

### 3. Lancer l'App

```bash
# Voir les appareils disponibles
flutter devices

# Lancer sur un appareil
flutter run

# Ou avec un émulateur spécifique
flutter run -d emulator-5554
```

### 4. Commencer à Développer

L'application démarre avec un écran de sélection de rôle:
- **Touriste** → Accueil avec destinations
- **Admin** → Tableau de bord administrateur

## 📁 Structure Rapide

```
lib/
├── main.dart ........................... Point d'entrée
├── screens/user/ ...................... Écrans touristes
├── screens/admin/ .................... Écrans admin
├── models/ ........................... Classes de données
├── providers/ ........................ Gestion d'état
└── widgets/ ......................... Composants UI
```

## 🛠️ Tâches Courantes

### Ajouter une Dépendance
```bash
flutter pub add nom_package
```

### Formater le Code
```bash
flutter format lib/
```

### Analyser le Code
```bash
flutter analyze
```

### Générer les Modèles (si nécessaire)
```bash
flutter packages pub run build_runner build
```

### Voir les Logs
```bash
flutter logs
```

## 🎯 Déploiement Rapide

### Android
```bash
flutter build apk --release
# APK généré: build/app/outputs/flutter-app.apk
```

### iOS
```bash
flutter build ipa --release
# IPA généré: build/ios/ipa/
```

## 🐛 Troubleshooting

### "flutter: command not found"
```bash
# Ajouter Flutter au PATH
export PATH="$PATH:`pwd`/flutter/bin"
```

### Erreur de compilation
```bash
# Solution complète
flutter clean
flutter pub get
flutter run
```

### Erreur d'émulateur
```bash
# Lister les appareils
flutter devices

# Créer un nouvel émulateur
flutter emulators --create --name my_phone
flutter emulators --launch my_phone
```

### Erreur "Xcode not found" (iOS)
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

## 📱 Tester Différentes Tailles d'Écran

```bash
# Pixel 5
flutter run -d pixel5

# iPhone 13
flutter run -d "iPhone 13"

# Appareil physique
flutter run -d <device_id>
```

## 🌐 Support Web (Expérimental)

```bash
# Lancer sur web
flutter run -d chrome

# Build web
flutter build web --release
```

## 📊 Monitorer l'App

### DevTools
```bash
flutter pub global activate devtools
flutter pub global run devtools

# Ou avec flutter
flutter pub activate devtools
```

### Profiling
```bash
# Mode profile
flutter run --profile

# Mode release
flutter run --release
```

## 🔗 Ressources Utiles

- [Flutter Docs](https://flutter.dev/docs)
- [Dart Documentation](https://dart.dev/guides)
- [Provider Package](https://pub.dev/packages/provider)
- [Material Design](https://material.io/design)

## 💡 Tips & Tricks

### Hot Reload
- Appuyer sur `r` → Hot reload (rapide)
- Appuyer sur `R` → Hot restart (complet)
- Ctrl+C → Arrêter l'app

### Paramètres de Run
```bash
# Mode debug
flutter run

# Mode profile (pour les perf)
flutter run --profile

# Mode release (optimisé)
flutter run --release

# Avec logs verbeux
flutter run -v
```

### Visualiser les Layouts
```dart
// Dans main.dart, ajouter:
debugPaintSizeEnabled = true; // Montre les tailles
debugPaintBaselinesEnabled = true; // Montre les baselines
```

## 🚫 Erreurs Courantes

| Erreur | Solution |
|--------|----------|
| `Gradle sync failed` | `flutter clean && flutter pub get` |
| `CocoaPods error` | `cd ios && pod install` |
| `App crashes` | Vérifier les logs avec `flutter logs` |
| `Écran blanc` | Vérifier main.dart et MaterialApp |
| `Image not loading` | Vérifier l'URL et les permissions |

## ✅ Checklist Avant Production

- [ ] Tests passent (`flutter test`)
- [ ] Code analysé (`flutter analyze`)
- [ ] Pas de hardcode values
- [ ] Images optimisées
- [ ] Permissions configurées
- [ ] API keys sécurisées
- [ ] Version mise à jour
- [ ] Icons et splash screen configurés

## 📞 Besoin d'Aide?

1. Vérifier la [documentation](../GUIDE_COMPLET.md)
2. Consulter [Configuration](../CONFIG.md)
3. Voir [Extension Guide](../EXTENSION_GUIDE.md)
4. Ouvrir une issue sur GitHub

---

**Bon développement! 🎉**
