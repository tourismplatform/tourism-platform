import 'package:flutter/material.dart';
import '../models/index.dart';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  String? _error;
  List<Address> _addresses = [
    Address(
      id: '1',
      title: 'Domicile',
      subtitle: '123 Avenue Kwame Nkrumah, Ouaga',
      iconStr: 'home_rounded',
      colorStr: 'blue',
    ),
    Address(
      id: '2',
      title: 'Bureau',
      subtitle: 'Zone ZACA, Ouagadougou',
      iconStr: 'work_rounded',
      colorStr: 'green',
    ),
  ];

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Address> get addresses => _addresses;
  bool get isAuthenticated => _currentUser != null;

  final List<User> _allUsers = [
    User(
      id: '1',
      email: 'admin@tourbf.bf',
      firstName: 'Admin',
      lastName: 'Sys',
      role: UserRole.admin,
    ),
    User(
      id: '2',
      email: 'touriste@voyage.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.tourist,
    ),
  ];

  List<User> get allUsers => _allUsers;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulation de la connexion
      await Future.delayed(const Duration(seconds: 1));
      _currentUser = User(
        id: '1',
        email: email,
        firstName: 'Nom',
        lastName: 'Utilisateur',
        role: UserRole.tourist,
      );
      _error = null;
    } catch (e) {
      _error = 'Erreur lors de la connexion';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    notifyListeners();
  }

  void updateUser({String? firstName, String? lastName, String? email}) {
    if (_currentUser != null) {
      _currentUser = User(
        id: _currentUser!.id,
        email: email ?? _currentUser!.email,
        firstName: firstName ?? _currentUser!.firstName,
        lastName: lastName ?? _currentUser!.lastName,
        role: _currentUser!.role,
      );
      notifyListeners();
    }
  }

  void addAddress(String title, String subtitle) {
    final newAddress = Address(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      subtitle: subtitle,
    );
    _addresses.add(newAddress);
    notifyListeners();
  }

  void updateAddress(String id, String title, String subtitle) {
    final index = _addresses.indexWhere((addr) => addr.id == id);
    if (index >= 0) {
      _addresses[index] = Address(
        id: id,
        title: title,
        subtitle: subtitle,
        iconStr: _addresses[index].iconStr,
        colorStr: _addresses[index].colorStr,
      );
      notifyListeners();
    }
  }

  void deleteAddress(String id) {
    _addresses.removeWhere((addr) => addr.id == id);
    notifyListeners();
  }

  Future<void> signup(
    String firstName,
    String lastName,
    String email,
    String password,
  ) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulation de l'inscription
      await Future.delayed(const Duration(seconds: 1));
      _currentUser = User(
        id: '2',
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: UserRole.tourist,
      );
      _error = null;
    } catch (e) {
      _error = 'Erreur lors de l\'inscription';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
