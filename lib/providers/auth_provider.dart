import 'package:flutter/material.dart';
import '../models/index.dart';
import '../services/auth_service.dart';
import 'package:uuid/uuid.dart';
import '../constants/constants.dart';
import '../services/api_service.dart';

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
  String? _token;

  final List<AddressModel> _addresses = [
    AddressModel(
      id: '1',
      title: 'Domicile',
      subtitle: 'Ouagadougou, Secteur 15',
      iconStr: 'home_rounded',
      colorStr: 'blue',
    ),
    AddressModel(
      id: '2',
      title: 'Bureau',
      subtitle: 'Bobo-Dioulasso, Centre-ville',
      iconStr: 'work_rounded',
      colorStr: 'green',
    ),
  ];

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;
  List<AddressModel> get addresses => _addresses;
  String? get profilePhotoPath => _profilePhotoPath;
  String? get token => _token;

  AuthProvider() {
    _checkStatus();
  }

  Future<void> _checkStatus() async {
    final loggedIn = await AuthService.isLoggedIn();
    if (loggedIn) {
      await fetchCurrentUser();
    }
  }

  Future<void> fetchCurrentUser() async {
    try {
      final userData = await AuthService.getMe();
      _currentUser = User.fromJson(userData);
      notifyListeners();
    } catch (e) {
      await logout();
    }
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

  void updateProfilePhoto(String path) {
    _profilePhotoPath = path;
    notifyListeners();
  }

  void addAddress(String title, String subtitle) {
    _addresses.add(
      AddressModel(id: const Uuid().v4(), title: title, subtitle: subtitle),
    );
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

  Future<void> loadSession() async {
    final t = await ApiService.getToken();
    if (t == null || t.isEmpty) return;
    _token = t;
    try {
      final json = await ApiService.get(authMeEndpoint, token: _token);
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      if (data is Map<String, dynamic>) {
        _currentUser = User.fromJson(data);
      }
    } catch (_) {
      _token = null;
      _currentUser = null;
      await ApiService.clearToken();
    } finally {
      notifyListeners();
    }
  }

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final json = await ApiService.post(
        authLoginEndpoint,
        body: {'email': email, 'password': password},
      );
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      if (data is! Map<String, dynamic>) {
        throw Exception('Réponse login invalide');
      }
      final token = (data['token'] ?? '').toString();
      final userJson = data['user'];
      if (token.isEmpty || userJson is! Map<String, dynamic>) {
        throw Exception('Token ou user manquant');
      }
      _token = token;
      await ApiService.setToken(token);
      _currentUser = User.fromJson(userJson);
      _error = null;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    _currentUser = null;
    _token = null;
    await ApiService.clearToken();
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
      final name = '$firstName $lastName'.trim();
      final json = await ApiService.post(
        authRegisterEndpoint,
        body: {
          'name': name.isEmpty ? firstName : name,
          'email': email,
          'password': password,
        },
      );
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      if (data is! Map<String, dynamic>) {
        throw Exception('Réponse inscription invalide');
      }
      final token = (data['token'] ?? '').toString();
      final userJson = data['user'];
      if (token.isEmpty || userJson is! Map<String, dynamic>) {
        throw Exception('Token ou user manquant');
      }
      _token = token;
      await ApiService.setToken(token);
      _currentUser = User.fromJson(userJson);
      _error = null;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
