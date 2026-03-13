# Guide d'Extension - TourbF

Ce document explique comment étendre et personnaliser l'application TourbF.

## 1. Ajouter une Nouvelle Destination

### Étapes :

1. **Ajouter à la base de données** via l'écran admin
2. **Ou** ajouter manuellement dans `constants.dart`

```dart
{
  'id': '4',
  'name': 'Bandougou',
  'description': 'Magnifique village touristique...',
  'location': 'Bobo-Dioulasso, Burkina Faso',
  'category': 'Culture',
  'rating': 4.7,
  'numberOfReviews': 89,
  'pricePerPerson': 35000,
  'imageUrls': ['https://example.com/image.jpg'],
  'mapUrl': 'https://maps.google.com',
  'isActive': true,
}
```

## 2. Intégrer une API Backend

### Modifier `destination_provider.dart` :

```dart
Future<void> loadDestinations() async {
  _isLoading = true;
  _error = null;
  notifyListeners();

  try {
    final response = await http.get(
      Uri.parse('$apiBaseUrl$destinationsEndpoint'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      _destinations = data
          .map((json) => Destination.fromJson(json))
          .toList();
    } else {
      throw Exception('Erreur API: ${response.statusCode}');
    }
  } catch (e) {
    _error = 'Erreur: $e';
  } finally {
    _isLoading = false;
    notifyListeners();
  }
}
```

## 3. Ajouter une Nouvelle Fonctionnalité

### Exemple : Système de Favoris

1. **Créer le Provider**
```dart
class FavoritesProvider extends ChangeNotifier {
  List<String> _favoriteIds = [];
  
  List<String> get favoriteIds => _favoriteIds;
  
  void toggleFavorite(String destinationId) {
    if (_favoriteIds.contains(destinationId)) {
      _favoriteIds.remove(destinationId);
    } else {
      _favoriteIds.add(destinationId);
    }
    notifyListeners();
  }
  
  bool isFavorite(String destinationId) {
    return _favoriteIds.contains(destinationId);
  }
}
```

2. **Ajouter au MyApp**
```dart
MultiProvider(
  providers: [
    // ... autres providers
    ChangeNotifierProvider(create: (_) => FavoritesProvider()),
  ],
  // ...
)
```

3. **Utiliser dans l'UI**
```dart
Consumer<FavoritesProvider>(
  builder: (context, favorites, _) {
    return IconButton(
      icon: Icon(
        favorites.isFavorite(destinationId)
            ? Icons.favorite
            : Icons.favorite_border,
      ),
      onPressed: () => favorites.toggleFavorite(destinationId),
    );
  },
)
```

## 4. Personnaliser le Thème

### Modifier `constants/theme.dart` :

```dart
class AppTheme {
  static const Color primaryColor = Color(0xFF2196F3);
  static const Color accentColor = Color(0xFFFFC107);
  
  // Ajouter vos couleurs personnalisées
  static const Color customColor = Color(0xFF123456);
  
  // Modifier les styles
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryColor,
    ),
    // ... autres configurations
  );
}
```

## 5. Implémenter l'Authentification Firebase

### Installation
```bash
flutter pub add firebase_core
flutter pub add firebase_auth
```

### Configuration dans main.dart
```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const MyApp());
}
```

### Utiliser dans AuthProvider
```dart
class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  Future<void> login(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      _error = e.toString();
    } finally {
      notifyListeners();
    }
  }
}
```

## 6. Ajouter des Notifications Push

### Installation
```bash
flutter pub add firebase_messaging
```

### Setup
```dart
final FirebaseMessaging _messaging = FirebaseMessaging.instance;

void setupNotifications() {
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    // Afficher notification
  });
}
```

## 7. Implémenter la Géolocalisation

### Code Exemple
```dart
import 'package:geolocator/geolocator.dart';

Future<Position> getCurrentLocation() async {
  return await Geolocator.getCurrentPosition(
    desiredAccuracy: LocationAccuracy.high,
  );
}
```

## 8. Ajouter des Tests Unitaires

### Créer un fichier test
```dart
// test/providers/destination_provider_test.dart
void main() {
  group('DestinationProvider', () {
    late DestinationProvider provider;
    
    setUp(() {
      provider = DestinationProvider();
    });
    
    test('load destinations', () async {
      await provider.loadDestinations();
      expect(provider.destinations.isNotEmpty, true);
    });
  });
}
```

### Lancer les tests
```bash
flutter test
```

## 9. Optimiser les Performances

### Lazy Loading
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    // Items chargés à la demande
  },
)
```

### Caching
```dart
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => Shimmer.fromColors(...),
  cacheManager: CacheManager.instance,
)
```

## 10. Déploiement

### Préparation
1. Vérifier les icônes et splash screens
2. Tester sur plusieurs appareils
3. Vérifier le manifest Android
4. Configurer les identifiants iOS

### Build
```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ipa --release

# Web
flutter build web --release
```

## 11. Gestion des Erreurs

### Pattern Global
```dart
try {
  // Code
} catch (e) {
  _error = 'Erreur: $e';
  print('Stack trace: $e');
} finally {
  notifyListeners();
}
```

### Affichage aux Utilisateurs
```dart
if (provider.error != null) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(provider.error!)),
  );
}
```

## 12. Meilleures Pratiques

✅ **À faire**
- Utiliser Provider pour la gestion d'état
- Créer des widgets réutilisables
- Documenter le code
- Utiliser des constantes
- Gérer les erreurs
- Optimiser les performances

❌ **À éviter**
- État global sans Provider
- Code en dur (hardcoding)
- Longs build methods
- Appels API dans les widgets
- Ignorer les erreurs

## Ressources

- [Documentation Flutter](https://flutter.dev/docs)
- [Dart Language](https://dart.dev/)
- [Provider Documentation](https://pub.dev/packages/provider)
- [Firebase Documentation](https://firebase.google.com/docs)
