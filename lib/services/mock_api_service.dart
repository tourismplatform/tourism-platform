import '../models/index.dart';
import '../constants/constants.dart';

class MockApiService {
  /// Simule l'appel API pour récupérer les destinations
  static Future<List<Destination>> fetchDestinations() async {
    await Future.delayed(const Duration(seconds: 1));
    return mockDestinations.map((json) => Destination.fromJson(json)).toList();
  }

  /// Simule l'appel API pour récupérer une destination spécifique
  static Future<Destination?> fetchDestinationById(String id) async {
    await Future.delayed(const Duration(milliseconds: 500));
    try {
      final json = mockDestinations.firstWhere((dest) => dest['id'] == id);
      return Destination.fromJson(json);
    } catch (e) {
      return null;
    }
  }

  /// Simule la création d'une réservation
  static Future<bool> createReservation(Reservation reservation) async {
    await Future.delayed(const Duration(seconds: 2));
    // Retourner true pour succès, false pour erreur
    return true;
  }

  /// Simule la récupération des réservations d'un utilisateur
  static Future<List<Reservation>> fetchUserReservations(String userId) async {
    await Future.delayed(const Duration(seconds: 1));
    return [];
  }

  /// Simule le traitement du paiement
  static Future<bool> processPayment({
    required String cardNumber,
    required String expiryDate,
    required String cvv,
    required double amount,
  }) async {
    await Future.delayed(const Duration(seconds: 2));
    // Valider les données de la carte
    if (cardNumber.length < 16 || cvv.length < 3) {
      throw Exception('Données de carte invalides');
    }
    return true;
  }

  /// Simule l'ajout d'un avis
  static Future<bool> addReview(Review review) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  /// Simule l'authentification
  static Future<User?> login(String email, String password) async {
    await Future.delayed(const Duration(seconds: 1));
    if (email.isEmpty || password.isEmpty) {
      throw Exception('Email et mot de passe requis');
    }
    return User(
      id: 'user_${email.hashCode}',
      email: email,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.tourist,
    );
  }

  /// Simule l'inscription
  static Future<User?> signup({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    await Future.delayed(const Duration(seconds: 1));
    if (email.isEmpty || password.isEmpty) {
      throw Exception('Données requises manquantes');
    }
    return User(
      id: 'user_${email.hashCode}',
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: UserRole.tourist,
    );
  }

  /// Mock data pour les avis
  static List<Review> getMockReviews(String destinationId) {
    return [
      Review(
        id: '1',
        destinationId: destinationId,
        userId: 'user1',
        userName: 'Alice Durand',
        rating: 5,
        comment:
            'Destination magnifique! À recommander vivement. Très bonne expérience.',
        createdAt: DateTime.now().subtract(const Duration(days: 15)),
      ),
      Review(
        id: '2',
        destinationId: destinationId,
        userId: 'user2',
        userName: 'Marc Bernard',
        rating: 4,
        comment: 'Très beau, mais un peu cher. Sinon très bon service.',
        createdAt: DateTime.now().subtract(const Duration(days: 8)),
      ),
      Review(
        id: '3',
        destinationId: destinationId,
        userId: 'user3',
        userName: 'Sophie Martin',
        rating: 5,
        comment: 'Expérience inoubliable! Je recommande à 100%.',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
  }

  /// Valider une réservation (Admin)
  static Future<bool> approveReservation(String reservationId) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  /// Refuser une réservation (Admin)
  static Future<bool> rejectReservation(String reservationId) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  /// Récupérer les réservations en attente (Admin)
  static Future<List<Reservation>> fetchPendingReservations() async {
    await Future.delayed(const Duration(seconds: 1));
    return [];
  }

  /// Mettre à jour une destination (Admin)
  static Future<bool> updateDestination(Destination destination) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  /// Récupérer les statistiques (Admin)
  static Future<Map<String, dynamic>> fetchAdminStats() async {
    await Future.delayed(const Duration(seconds: 1));
    return {
      'totalReservations': 248,
      'pendingReservations': 12,
      'totalDestinations': 25,
      'totalUsers': 156,
      'revenue': 5240000,
    };
  }
}
