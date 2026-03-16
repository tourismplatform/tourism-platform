import 'package:flutter/material.dart';
import '../models/index.dart';
import 'package:uuid/uuid.dart';

class AddressModel {
  final String id;
  String title;
  String subtitle;
  String iconStr;
  String colorStr;

  AddressModel({
    required this.id,
    required this.title,
    required this.subtitle,
    this.iconStr = 'location_on',
    this.colorStr = 'orange',
  });
}

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  String? _error;
  String? _profilePhotoPath; // local path to profile photo
  
  final List<AddressModel> _addresses = [
    AddressModel(id: '1', title: 'Domicile', subtitle: 'Ouagadougou, Secteur 15', iconStr: 'home_rounded', colorStr: 'blue'),
    AddressModel(id: '2', title: 'Bureau', subtitle: 'Bobo-Dioulasso, Centre-ville', iconStr: 'work_rounded', colorStr: 'green'),
  ];

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;
  List<AddressModel> get addresses => _addresses;
  String? get profilePhotoPath => _profilePhotoPath;

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

  void updateProfilePhoto(String path) {
    _profilePhotoPath = path;
    notifyListeners();
  }

  void addAddress(String title, String subtitle) {
    _addresses.add(AddressModel(
      id: const Uuid().v4(),
      title: title,
      subtitle: subtitle,
    ));
    notifyListeners();
  }

  void updateAddress(String id, String title, String subtitle) {
    final index = _addresses.indexWhere((a) => a.id == id);
    if (index >= 0) {
      _addresses[index].title = title;
      _addresses[index].subtitle = subtitle;
      notifyListeners();
    }
  }

  void deleteAddress(String id) {
    _addresses.removeWhere((a) => a.id == id);
    notifyListeners();
  }

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
