import 'package:flutter/material.dart';
import '../models/index.dart';
import '../constants/constants.dart';

class DestinationProvider extends ChangeNotifier {
  List<Destination> _destinations = [];
  List<Destination> _filteredDestinations = [];
  bool _isLoading = false;
  String? _error;
  String _selectedCategory = 'Tous';
  String _searchQuery = '';

  List<Destination> get destinations => _filteredDestinations;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedCategory => _selectedCategory;

  DestinationProvider() {
    loadDestinations();
  }

  Future<void> loadDestinations() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulation du chargement - à remplacer par un appel API réel
      await Future.delayed(const Duration(seconds: 1));

      _destinations = mockDestinations
          .map((json) => Destination.fromJson(json))
          .toList();

      _filteredDestinations = _destinations;
      _error = null;
    } catch (e) {
      _error = 'Erreur lors du chargement des destinations';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void filterByCategory(String category) {
    _selectedCategory = category;
    _applyFilters();
  }

  void resetFilter() {
    _selectedCategory = 'Tous';
    _searchQuery = '';
    _applyFilters();
  }

  void searchDestinations(String query) {
    _searchQuery = query;
    _applyFilters();
  }

  void _applyFilters() {
    _filteredDestinations = _destinations.where((destination) {
      final matchesCategory =
          _selectedCategory == 'Tous' ||
          destination.category.toLowerCase() == _selectedCategory.toLowerCase();
      final matchesSearch =
          _searchQuery.isEmpty ||
          destination.name.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();
    notifyListeners();
  }

  Destination? getDestinationById(String id) {
    try {
      return _destinations.firstWhere((dest) => dest.id == id);
    } catch (e) {
      return null;
    }
  }
}
