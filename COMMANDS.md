# 🛠️ Commandes Essentielles - TourbF

## Installation et Démarrage

### Installer Flutter et Dépendances
```bash
# Mettre à jour Flutter
flutter upgrade

# Vérifier l'installation
flutter doctor

# Installer les dépendances du projet
flutter pub get
```

### Lancer l'Application
```bash
# Lancer en mode debug (recommandé pour le développement)
flutter run

# Lancer en mode release
flutter run --release

# Lancer en mode profile (pour mesurer les performances)
flutter run --profile

# Lancer avec tous les logs verbeux
flutter run -v

# Lancer sur un appareil/émulateur spécifique
flutter run -d <device_id>
```

## Émulateurs et Appareils

### Voir les Appareils Disponibles
```bash
flutter devices
```

### Créer un Émulateur Android
```bash
flutter emulators --create --name my_phone
flutter emulators --launch my_phone
```

### Lancer un Appareil iOS
```bash
open -a Simulator
```

## Code Quality

### Formater le Code
```bash
# Formater tous les fichiers
flutter format lib/

# Formater un fichier spécifique
flutter format lib/main.dart
```

### Analyser le Code
```bash
# Analyse complète
flutter analyze

# Analyser un fichier spécifique
flutter analyze lib/main.dart
```

### Vérifier les Erreurs/Warnings
```bash
# Voir les problèmes dans VS Code
# Ou utiliser
flutter analyze --watch
```

## Gestion des Dépendances

### Ajouter une Dépendance
```bash
flutter pub add package_name
# Exemple:
flutter pub add provider
```

### Mettre à Jour les Dépendances
```bash
# Mettre à jour tout
flutter pub upgrade

# Mettre à jour une dépendance spécifique
flutter pub upgrade package_name
```

### Supprimer une Dépendance
```bash
flutter pub remove package_name
```

### Voir les Dépendances
```bash
flutter pub deps
flutter pub deps --style=compact
```

## Nettoyage et Maintenance

### Nettoyer les Fichiers Générés
```bash
flutter clean
```

### Nettoyer et Réinstaller
```bash
flutter clean
flutter pub get
flutter run
```

### Vider le Cache de Build
```bash
rm -rf build/
rm -rf .dart_tool/
flutter pub get
```

## Tests

### Exécuter les Tests
```bash
# Tous les tests
flutter test

# Tests avec couverture
flutter test --coverage

# Tests avec observer
flutter test --observer=observer.dart
```

### Générer un Rapport de Couverture
```bash
flutter test --coverage
lcov --list coverage/lcov.info
```

## Build et Déploiement

### Android

#### Build APK
```bash
# Debug
flutter build apk

# Release
flutter build apk --release

# Voir la taille
flutter build apk --release --analyze-size
```

#### Build App Bundle
```bash
flutter build appbundle --release
```

#### Installer sur Appareil
```bash
flutter install
# ou
adb install -r build/app/outputs/app-release.apk
```

### iOS

#### Build IPA
```bash
flutter build ipa --release
```

#### Build pour Simulator
```bash
flutter build ios --simulator --release
```

### Web

#### Build Web
```bash
# Debug
flutter build web

# Release
flutter build web --release
```

#### Servir localement
```bash
flutter run -d chrome
```

## Débogage

### Afficher les Logs
```bash
# Tous les logs
flutter logs

# Logs avec couleurs
flutter logs --color

# Logs filtrés
flutter logs | grep "MyTag"
```

### Debugger

#### Hot Reload
```
- Dans le terminal, appuyez sur 'r' pendant que l'app tourne
- L'app se recharge sans perdre l'état
```

#### Hot Restart
```
- Appuyez sur 'R' dans le terminal
- L'app redémarre complètement
```

#### Pause Exécution
```
- Appuyez sur 's' pour prendre un screenshot
- Appuyez sur 'o' pour observer le mode
```

## DevTools

### Lancer DevTools
```bash
flutter pub global activate devtools
flutter pub global run devtools

# Ou automatiquement
flutter run
# L'URL est affichée dans la console
```

### Utiliser DevTools
```
- Aller à l'URL affichée
- Vous avez accès à:
  - Debugger
  - Console
  - Memory
  - Performance
  - Network
  - Logging
  - App Size
```

## Profiling et Performance

### Profiler l'Application
```bash
flutter run --profile
# DevTools > Performance tab
```

### Analyser la Taille de l'APK
```bash
flutter build apk --release --analyze-size
```

### Mesurer le Temps de Build
```bash
time flutter build apk --release
```

## Git et Version Control

### Initialiser Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Pousser vers Repo
```bash
git remote add origin <repository-url>
git push -u origin main
```

### Ignorer les Fichiers
```bash
# Utilisez .gitignore (déjà configuré)
# Fichiers importants à ignorer:
- /build/
- /.dart_tool/
- /.packages
- /pubspec.lock (parfois)
```

## Documentation

### Générer la Documentation
```bash
# Générer la doc Dart
dartdoc
```

## Utilitaires

### Voir les Infos Système
```bash
flutter doctor -v
```

### Obtenir la Version Flutter
```bash
flutter --version
```

### Lister les Canaux Flutter
```bash
flutter channel
```

### Changer de Canal
```bash
flutter channel stable   # Production
flutter channel beta     # Pré-release
flutter channel dev      # Développement
```

## Environnement

### Définir des Variables d'Environnement
```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
export PATH="$PATH:$HOME/flutter/bin"
export ANDROID_HOME="$HOME/Android/sdk"
```

### Vérifier le Setup
```bash
flutter doctor
```

## Problèmes Courants

### Erreur "command not found: flutter"
```bash
export PATH="$PATH:`pwd`/flutter/bin"
```

### Erreur de compilation Gradle
```bash
flutter clean
flutter pub get
cd android && ./gradlew clean && cd ..
flutter run
```

### Erreur CocoaPods
```bash
cd ios
pod install
cd ..
flutter run
```

### Cache corrompu
```bash
flutter clean
rm -rf pubspec.lock
flutter pub get
```

## Tips & Tricks

### Raccourcis en Mode Debug
```
r     - Hot reload
R     - Hot restart
s     - Screenshot
o     - Observer mode
q     - Quitter
```

### Désactiver les Animations en Debug
```bash
# Pour tester les performances
# Dans DevTools > Timeline
```

### Tester sur Plusieurs Appareils
```bash
# Terminal 1
flutter run -d device1

# Terminal 2
flutter run -d device2
```

### Exécuter un Seul Fichier de Test
```bash
flutter test test/models/destination_test.dart
```

## Raccourcis VS Code

```
Ctrl+Shift+P  - Commande palette
Ctrl+F        - Chercher
Ctrl+H        - Remplacer
Ctrl+/        - Commenter
Ctrl+Shift+F  - Chercher partout
Alt+Shift+F   - Formater le document
```

## Ressources

- [Flutter Docs](https://flutter.dev/docs)
- [Dart Docs](https://dart.dev/guides)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/flutter)
- [Flutter Community](https://flutter.dev/community)

---

**Note**: Assurez-vous que Flutter est installé et dans votre PATH avant d'exécuter ces commandes.

**Dernière mise à jour**: Mars 2026
