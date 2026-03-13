# 📸 Guide d'Intégration des Vraies Images

Ce guide explique comment ajouter et afficher des vraies images pour les sites touristiques burkinabès dans votre application.

---

## 🚀 Étapes pour Intégrer les Vraies Images

### **Étape 1 : Préparer les Images Locales**

1. **Créez un dossier pour les images** :
   ```
   assets/
   └── images/
       ├── pics_sindou_1.jpg
       ├── pics_sindou_2.jpg
       ├── parc_w_1.jpg
       ├── parc_w_2.jpg
       ├── parc_ziniare_1.jpg
       ├── parc_ziniare_2.jpg
       ├── lac_tingrela_1.jpg
       ├── lac_tingrela_2.jpg
       ├── tiebele_1.jpg
       ├── tiebele_2.jpg
       ├── musee_manega_1.jpg
       ├── musee_manega_2.jpg
       ├── musee_national_1.jpg
       ├── musee_national_2.jpg
       ├── sabou_1.jpg
       ├── sabou_2.jpg
       ├── bobo_mosquee_1.jpg
       └── bobo_mosquee_2.jpg
   ```

2. **Sous Windows/Linux** : Ajouter manuellement les fichiers images au dossier `assets/images/`.

3. **Sous macOS** : À partir du Terminal :
   ```bash
   mkdir -p assets/images
   cd assets/images
   # Copier vos images JPG/PNG ici
   ```

---

### **Étape 2 : Modifier `pubspec.yaml` ✅ (DÉJÀ FAIT)**

Le fichier `pubspec.yaml` a été modifié pour déclarer les assets :

```yaml
flutter:
  uses-material-design: true

  assets:
    - assets/images/
```

---

### **Étape 3 : Mettre à Jour les Constantes**

Modifiez le fichier `lib/constants/constants.dart` pour utiliser les images locales :

**Option A : Images locales uniquement**

```dart
const List<Map<String, dynamic>> mockDestinations = [
  {
    'id': '1',
    'name': 'Pics de Sindou',
    'description': '...',
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
  // ... autres destinations
];
```

**Option B : Images locales + URL de secours (recommandé)**

```dart
'imageUrls': [
  'assets/images/pics_sindou_1.jpg',
  'assets/images/pics_sindou_2.jpg',
],
'imageUrlsFallback': [
  'https://images.pexels.com/photos/421511/pexels-photo-421511.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/386148/pexels-photo-386148.jpeg?auto=compress&cs=tinysrgb&w=600',
],
```

---

### **Étape 4 : Créer un Widget de Chargement Intelligent**

Créez un nouveau fichier `lib/widgets/smart_image_loader.dart` :

```dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class SmartImageLoader extends StatelessWidget {
  final String imageUrl;
  final String? fallbackUrl;
  final BoxFit fit;
  final double width;
  final double height;

  const SmartImageLoader({
    Key? key,
    required this.imageUrl,
    this.fallbackUrl,
    this.fit = BoxFit.cover,
    this.width = double.infinity,
    this.height = 200,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Si l'image est un asset local
    if (imageUrl.startsWith('assets/')) {
      return Image.asset(
        imageUrl,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: width,
            height: height,
            color: Colors.grey[300],
            child: const Center(
              child: Icon(Icons.image_not_supported),
            ),
          );
        },
      );
    }

    // Si c'est une URL distante
    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) => Container(
        width: width,
        height: height,
        color: Colors.grey[300],
        child: const Center(child: CircularProgressIndicator()),
      ),
      errorWidget: (context, url, error) {
        // Utiliser le fallback si disponible
        if (fallbackUrl != null) {
          return SmartImageLoader(
            imageUrl: fallbackUrl!,
            fit: fit,
            width: width,
            height: height,
          );
        }
        return Container(
          width: width,
          height: height,
          color: Colors.grey[300],
          child: const Center(
            child: Icon(Icons.image_not_supported),
          ),
        );
      },
    );
  }
}
```

---

### **Étape 5 : Modifier les Widgets pour Utiliser les Nouvelles Images**

Mettez à jour `lib/widgets/destination_card.dart` :

Cherchez :
```dart
CachedNetworkImage(
  imageUrl: destination.imageUrls.isNotEmpty 
    ? destination.imageUrls[0]
    : defaultPlaceholder,
```

Remplacez par :
```dart
SmartImageLoader(
  imageUrl: destination.imageUrls.isNotEmpty 
    ? destination.imageUrls[0]
    : 'assets/images/placeholder.png',
  fallbackUrl: destination.imageUrls.length > 1
    ? destination.imageUrls[1]
    : null,
```

Identiquement dans `lib/screens/user/destination_detail_screen.dart` pour la galerie.

---

### **Étape 6 : Ajouter l'Export dans `lib/widgets/index.dart`**

Ajoutez la ligne :
```dart
export 'smart_image_loader.dart';
```

---

## 📋 Exemple Complet : Pics de Sindou

### Fichier Images :
```
assets/images/
├── pics_sindou_1.jpg (image principale)
└── pics_sindou_2.jpg (image secondaire)
```

### Constantes :
```dart
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
}
```

### Dans le Widget :
```dart
SmartImageLoader(
  imageUrl: 'assets/images/pics_sindou_1.jpg',
  fit: BoxFit.cover,
  width: 300,
  height: 200,
)
```

---

## ✅ Checklist d'Intégration

- [ ] Créer le dossier `assets/images/`
- [ ] Ajouter les images JPG/PNG dans le dossier
- [ ] Vérifier que `pubspec.yaml` déclare `assets: - assets/images/`
- [ ] Mettre à jour `constants.dart` avec les chemins locaux
- [ ] Créer `smart_image_loader.dart` pour le chargement intelligent
- [ ] Mettre à jour les widgets qui affichent les images
- [ ] Exporter le nouveau widget dans `widgets/index.dart`
- [ ] Exécuter `flutter pub get` ou `flutter clean && flutter pub get`
- [ ] Tester l'affichage sur un appareil ou émulateur

---

## 🐛 Troubleshooting

### Les images ne s'affichent pas ?

1. **Vérifier le chemin exact** :
   ```bash
   ls -la assets/images/
   ```

2. **Réexécuter après modification du `pubspec.yaml`** :
   ```bash
   flutter clean
   flutter pub get
   flutter run
   ```

3. **Vérifier la casse** : Flutter est sensible à la casse sur Linux !
   ```
   ✅ assets/images/pics_sindou_1.jpg
   ❌ assets/images/Pics_Sindou_1.jpg (pas la même)
   ```

### Les images locales sont lentes au chargement ?

Utilisez le widget `SmartImageLoader` qui affiche un `placeholder` pendant le chargement.

### Je veux garder les URLs distantes ?

C'est compatible ! Laissez les images distantes dans `imageUrls` et créez un dossier `assets/images/` vide. Le widget `SmartImageLoader` gère les deux.

---

## 💾 Résumé de l'Architecture

```
projet_tourbf/
├── assets/
│   └── images/             # ← Vos images locales ici
│       ├── pics_sindou_1.jpg
│       ├── parc_w_1.jpg
│       └── ... (autres images)
├── lib/
│   ├── constants/
│   │   └── constants.dart  # ← Modifiez les chemins imageUrls
│   ├── widgets/
│   │   ├── smart_image_loader.dart  # ← Nouveau widget
│   │   ├── destination_card.dart    # ← Utilisez SmartImageLoader
│   │   └── index.dart               # ← Exporter SmartImageLoader
│   └── screens/
└── pubspec.yaml            # ✅ Déjà modifié
```

---

## 🚀 Commande Finale

Une fois tout configuré, lancez l'app :

```bash
cd /home/ouedraogo/Bureau/projet_tourbf
flutter pub get
flutter run
```

Bonne chance ! 🇧🇫
