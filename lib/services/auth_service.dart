import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import 'api_service.dart';

class AuthService {
  static Future<bool> login(String email, String password) async {
    final data = await ApiService.post(
      ApiConstants.login,
      body: {'email': email, 'password': password},
    );
    final token = data['access_token'];
    if (token != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', token);
      return true;
    }
    return false;
  }

  static Future<bool> register(
    String email,
    String password,
    String name,
  ) async {
    final data = await ApiService.post(
      ApiConstants.register,
      body: {'email': email, 'password': password, 'name': name},
    );
    return data != null;
  }

  static Future<Map<String, dynamic>> getMe() async {
    return await ApiService.get(ApiConstants.me, auth: true);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token') != null;
  }
}
