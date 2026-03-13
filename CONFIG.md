# Configuration d'Environnement - TourbF

## Variables d'Environnement

### API Configuration
```
API_BASE_URL=https://api.tourismburkina.com
API_TIMEOUT=30000
```

### Firebase Configuration
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
```

### Stripe Configuration
```
STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

### Google Maps Configuration
```
GOOGLE_MAPS_API_KEY=your_api_key
```

## Configuration Android

### AndroidManifest.xml
```xml
<manifest ...>
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <application ...>
        <!-- Google Maps -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAPS_API_KEY" />
    </application>
</manifest>
```

## Configuration iOS

### Info.plist
```xml
<dict>
    <!-- Permissions -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location to show nearby destinations</string>
    
    <!-- Google Maps -->
    <key>GoogleMapsKey</key>
    <string>YOUR_GOOGLE_MAPS_API_KEY</string>
</dict>
```

## Flutter Pub Dependencies

Pour installer les dépendances :
```bash
flutter pub get
```

Pour mettre à jour :
```bash
flutter pub upgrade
```

## Build Configuration

### Debug
```bash
flutter run -d <device_id>
flutter run --profile
```

### Release
```bash
flutter build apk --release
flutter build ipa --release
flutter build web --release
```

## Configuration du Backend

### URL API par Environnement

**Development**
```
API_BASE_URL=http://localhost:8080
```

**Staging**
```
API_BASE_URL=https://staging-api.tourismburkina.com
```

**Production**
```
API_BASE_URL=https://api.tourismburkina.com
```

## Initialisation de l'Application

1. Configurer les variables d'environnement
2. Ajouter les fichiers de configuration
3. Exécuter `flutter pub get`
4. Lancer l'application avec `flutter run`

## Notes Importantes

- Les clés API ne doivent JAMAIS être commitées dans Git
- Utiliser des fichiers `.env` ou des services de gestion des secrets
- Changer les clés en passant de dev à production
- Valider toutes les configurations avant le déploiement

## Troubleshooting

### Erreurs de Build
- Vérifier que les SDK Android/iOS sont installés
- Exécuter `flutter clean && flutter pub get`
- Mettre à jour Flutter : `flutter upgrade`

### Erreurs d'API
- Vérifier la connexion Internet
- Vérifier l'URL API
- Vérifier les clés d'authentification

### Erreurs de Paiement
- Vérifier les clés Stripe
- Vérifier le mode test/production
- Vérifier les logs Stripe
