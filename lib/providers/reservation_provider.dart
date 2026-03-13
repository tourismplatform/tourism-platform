import 'package:flutter/material.dart';
import '../models/index.dart';

class ReservationProvider extends ChangeNotifier {
  final List<Reservation> _reservations = [];
  bool _isLoading = false;
  String? _error;

  List<Reservation> get reservations => _reservations;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadReservations(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulation du chargement - à remplacer par un appel API réel
      await Future.delayed(const Duration(seconds: 1));
      // _reservations seront chargées depuis l'API
      _error = null;
    } catch (e) {
      _error = 'Erreur lors du chargement des réservations';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createReservation(Reservation reservation) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Appel API pour créer la réservation
      await Future.delayed(const Duration(seconds: 1));
      _reservations.add(reservation);
      _error = null;
    } catch (e) {
      _error = 'Erreur lors de la création de la réservation';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
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

  Future<void> cancelReservation(String id) async {
    await updateReservation(id, ReservationStatus.cancelled);
  }
}
