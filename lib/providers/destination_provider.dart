import 'package:flutter/material.dart';
import '../models/index.dart';
import '../services/destination_service.dart';

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
      final data = await DestinationService.getDestinations();
      
      _destinations = (data as List)
          .map((json) => Destination.fromJson(json))
          .toList();
      
      if (debugPrint != null) {
        debugPrint('✅ ${_destinations.length} destinations chargées avec succès.');
        if (_destinations.isNotEmpty) {
          debugPrint('   - Première destination: ${_destinations[0].name}');
          debugPrint('   - Images trouvées: ${_destinations[0].imageUrls.length}');
        }
      }
      
      _filteredDestinations = _destinations;
      _error = null;
    } catch (e) {
      if (debugPrint != null) debugPrint('❌ Erreur DestinationProvider: $e');
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