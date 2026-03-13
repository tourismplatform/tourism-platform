# 🎨 Exemples Pratiques - Intégration Images

## Exemple 1 : Images Locales (Simple)

```dart
// constants.dart
const List<Map<String, dynamic>> mockDestinations = [
  {
    'id': '1',
    'name': 'Pics de Sindou',
    'description': 'Formations rocheuses spectaculaires...',
    'location': 'Sindou, Burkina Faso',
    'category': 'Nature',
    'rating': 4.7,
    'numberOfReviews': 210,
    'pricePerPerson': 20000,
    'imageUrls': [
      'assets/images/pics_sindou_1.jpg',
      'assets/images/pics_sindou_2.jpg',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
];

// Structure des fichiers
assets/
└── images/
    ├── pics_sindou_1.jpg
    └── pics_sindou_2.jpg
```

---

## Exemple 2 : Images Hybrides (Local + Fallback)

```dart
// constants.dart
'imageUrls': [
  'assets/images/parc_w_1.jpg',
  'assets/images/parc_w_2.jpg',
  'https://images.pexels.com/photos/3423478/pexels-photo-3423478.jpeg',  // Fallback
],
```

**Avantages** :
- Images locales chargées rapidement
- Fallback distant si l'asset local échoue
- Compatible avec les deux systèmes

---

## Exemple 3 : Tous les Sites Burkinabès

```dart
const List<Map<String, dynamic>> mockDestinations = [
  {
    'id': '1',
    'name': 'Pics de Sindou',
    'category': 'Nature',
    'imageUrls': [
      'assets/images/pics_sindou_1.jpg',
      'assets/images/pics_sindou_2.jpg',
    ],
  },
  {
    'id': '2',
    'name': 'Parc W',
    'category': 'Aventure',
    'imageUrls': [
      'assets/images/parc_w_1.jpg',
      'assets/images/parc_w_2.jpg',
    ],
  },
  {
    'id': '3',
    'name': 'Parc de Ziniare',
    'category': 'Nature',
    'imageUrls': [
      'assets/images/parc_ziniare_1.jpg',
      'assets/images/parc_ziniare_2.jpg',
    ],
  },
  {
    'id': '4',
    'name': 'Lac Tingrela',
    'category': 'Nature',
    'imageUrls': [
      'assets/images/lac_tingrela_1.jpg',
      'assets/images/lac_tingrela_2.jpg',
    ],
  },
  {
    'id': '5',
    'name': 'Cour royale de Tiebele',
    'category': 'Culture',
    'imageUrls': [
      'assets/images/tiebele_1.jpg',
      'assets/images/tiebele_2.jpg',
    ],
  },
  {
    'id': '6',
    'name': 'Musée de Manega',
    'category': 'Culture',
    'imageUrls': [
      'assets/images/musee_manega_1.jpg',
      'assets/images/musee_manega_2.jpg',
    ],
  },
  {
    'id': '7',
    'name': 'Musée National',
    'category': 'Culture',
    'imageUrls': [
      'assets/images/musee_national_1.jpg',
      'assets/images/musee_national_2.jpg',
    ],
  },
  {
    'id': '8',
    'name': 'Mare aux caïmans sacré de Sabou',
    'category': 'Culture',
    'imageUrls': [
      'assets/images/sabou_1.jpg',
      'assets/images/sabou_2.jpg',
    ],
  },
  {
    'id': '9',
    'name': 'Mosquée de Bobo-Dioulasso',
    'category': 'Culture',
    'imageUrls': [
      'assets/images/bobo_mosquee_1.jpg',
      'assets/images/bobo_mosquee_2.jpg',
    ],
  },
];
```

---

## Exemple 4 : Utiliser SmartImageLoader Directement

```dart
// Dans un widget personnalisé
class MyCustomWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SmartImageLoader(
      imageUrl: 'assets/images/pics_sindou_1.jpg',
      fallbackUrl: 'https://via.placeholder.com/400x300',
      fit: BoxFit.cover,
      width: 300,
      height: 200,
      borderRadius: BorderRadius.circular(12),
    );
  }
}
```

---

## Exemple 5 : Liste d'Images Locales

```dart
// models/destination.dart - Ajoutez une propriété
class Destination {
  final List<String> imageUrls;  // Les chemins 'assets/images/...'
  
  // ... autres propriétés
}

// screens/user/destination_detail_screen.dart - Déjà modifié
// Le PageView utilise automatiquement SmartImageLoader
```

---

## 🖼️ Structure Complète des Assets

```
projet_tourbf/
├── assets/
│   └── images/
│       ├── pics_sindou_1.jpg
│       ├── pics_sindou_2.jpg
│       ├── parc_w_1.jpg
│       ├── parc_w_2.jpg
│       ├── parc_ziniare_1.jpg
│       ├── parc_ziniare_2.jpg
│       ├── lac_tingrela_1.jpg
│       ├── lac_tingrela_2.jpg
│       ├── tiebele_1.jpg
│       ├── tiebele_2.jpg
│       ├── musee_manega_1.jpg
│       ├── musee_manega_2.jpg
│       ├── musee_national_1.jpg
│       ├── musee_national_2.jpg
│       ├── sabou_1.jpg
│       ├── sabou_2.jpg
│       ├── bobo_mosquee_1.jpg
│       └── bobo_mosquee_2.jpg
├── lib/
│   ├── widgets/
│   │   └── smart_image_loader.dart    ← Nouveau !
│   └── constants/
│       └── constants.dart              ← À modifier
└── pubspec.yaml                        ← Déjà modifié
```

---

## ⚙️ Étapes Finales (Checklist)

- [ ] **Télécharger les images** pour les 9 sites
- [ ] **Les placer** dans `assets/images/`
- [ ] **Nombres les fichiers** accordingly :
  ```
  pics_sindou_1.jpg, pics_sindou_2.jpg
  parc_w_1.jpg, parc_w_2.jpg
  ... etc
  ```
- [ ] **Mettre à jour** `lib/constants/constants.dart` avec les chemins assets
- [ ] **Exécuter** :
  ```bash
  flutter clean
  flutter pub get
  flutter run
  ```
- [ ] **Tester** : Vérifier que toutes les images s'affichent

---

## 🎯 Résultat Attendu

✅ **Home Screen** : Affiche les 9 destinations avec images locales
✅ **Destinations List** : Filtre par catégorie (Culture, Aventure, Nature)
✅ **Destination Detail** : Galerie avec PageView affichant les images
✅ **Performance** : Images locales chargées instantanément

---

## 📱 Tester sur Appareil

```bash
# Téléphone/Émulateur
flutter run

# Web
flutter run -d chrome

# iOS
flutter run -d iPhone

# Android
flutter run -d <device-id>
```

Bon développement ! 🇧🇫✨
