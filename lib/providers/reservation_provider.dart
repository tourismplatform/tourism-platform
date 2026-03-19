import 'package:flutter/material.dart';
import '../models/index.dart';
import '../constants/constants.dart';
import '../services/api_service.dart';

class ReservationProvider extends ChangeNotifier {
  final List<Reservation> _reservations = [];
  bool _isLoading = false;
  String? _error;

  // Retourne toutes les réservations (filtrées par userId si fourni)
  List<Reservation> getReservationsForUser(String userId) {
    if (userId.isEmpty) return _reservations;
    return _reservations.where((r) => r.userId == userId).toList();
  }

  // Getter général (rétro-compatibilité) - retourne toutes les réservations
  List<Reservation> get reservations => List.unmodifiable(_reservations);

  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadReservations(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final token = await ApiService.getToken();
      if (token == null || token.isEmpty) {
        _reservations.clear();
        throw Exception('Veuillez vous connecter');
      }
      final json = await ApiService.get(bookingsMyEndpoint, token: token);
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      _reservations
        ..clear()
        ..addAll(
          data is List
              ? data.whereType<Map<String, dynamic>>().map(
                  (e) => Reservation.fromJson(e),
                )
              : const Iterable<Reservation>.empty(),
        );
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Reservation?> createReservation(Reservation reservation) async {
    try {
      final token = await ApiService.getToken();
      if (token == null || token.isEmpty) {
        throw Exception('Veuillez vous connecter');
      }

      final body = {
        'destination_id': reservation.destinationId,
        'check_in': reservation.startDate.toIso8601String(),
        'check_out': reservation.endDate.toIso8601String(),
        'nb_persons': reservation.numberOfPeople,
      };

      final json = await ApiService.post(
        bookingsEndpoint,
        token: token,
        body: body,
      );
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      if (data is Map<String, dynamic>) {
        final created = Reservation.fromJson(data);
        _reservations.insert(0, created);
        _error = null;
        return created;
      }
      _error = null;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      notifyListeners();
    }
    return null;
  }

  Future<void> updateReservation(String id, ReservationStatus status) async {
    try {
      final index = _reservations.indexWhere((r) => r.id == id);
      if (index != -1) {
        _reservations[index] = Reservation(
          id: _reservations[index].id,
          userId: _reservations[index].userId,
          destinationId: _reservations[index].destinationId,
          destinationName: _reservations[index].destinationName,
          startDate: _reservations[index].startDate,
          endDate: _reservations[index].endDate,
          numberOfPeople: _reservations[index].numberOfPeople,
          totalPrice: _reservations[index].totalPrice,
          comment: _reservations[index].comment,
          status: status,
          createdAt: _reservations[index].createdAt,
        );
        notifyListeners();
      }
    } catch (e) {
      _error = 'Erreur lors de la mise à jour de la réservation';
    }
  }

  Future<bool> cancelReservation(String id) async {
    // Le backend actuel expose l'annulation uniquement côté admin.
    // On garde l'UI cohérente et on remonte un message.
    _error = 'Annulation non disponible pour le moment';
    notifyListeners();
    return false;
  }
}
