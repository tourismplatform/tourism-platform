import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/constants.dart';

class ApiService {
  static const _tokenKey = 'auth_token';

  static Uri _uri(String path, [Map<String, dynamic>? queryParameters]) {
    final base = Uri.parse(apiBaseUrl);
    return Uri(
      scheme: base.scheme,
      host: base.host,
      port: base.hasPort ? base.port : null,
      path: path,
      queryParameters: queryParameters?.map(
        (k, v) => MapEntry(k, v.toString()),
      ),
    );
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString('jwt_token', token); // Support for legacy AuthService
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove('jwt_token');
  }

  static Map<String, String> _headers({String? token}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static dynamic _decodeBody(http.Response res) {
    if (res.body.isEmpty) return null;
    return jsonDecode(utf8.decode(res.bodyBytes));
  }

  static Exception _httpError(http.Response res) {
    try {
      final body = _decodeBody(res);
      final msg = body is Map && body['message'] != null
          ? body['message'].toString()
          : 'Erreur HTTP ${res.statusCode}';
      return Exception(msg);
    } catch (_) {
      return Exception('Erreur HTTP ${res.statusCode}');
    }
  }

  static Future<dynamic> get(
    String path, {
    String? token,
    bool auth = false,
    Map<String, dynamic>? queryParameters,
  }) async {
    String? effectiveToken = token;
    if (auth && (token == null || token.isEmpty)) {
      effectiveToken = await getToken();
    }

    final res = await http.get(
      path.startsWith('http') ? Uri.parse(path) : _uri(path, queryParameters),
      headers: _headers(token: effectiveToken),
    );
    if (res.statusCode >= 200 && res.statusCode < 300) return _decodeBody(res);
    throw _httpError(res);
  }

  static Future<dynamic> post(
    String path, {
    String? token,
    bool auth = false,
    Map<String, dynamic>? body,
  }) async {
    String? effectiveToken = token;
    if (auth && (token == null || token.isEmpty)) {
      effectiveToken = await getToken();
    }

    final res = await http.post(
      path.startsWith('http') ? Uri.parse(path) : _uri(path),
      headers: _headers(token: effectiveToken),
      body: jsonEncode(body ?? const {}),
    );
    if (res.statusCode >= 200 && res.statusCode < 300) return _decodeBody(res);
    throw _httpError(res);
  }

  static Future<dynamic> put(
    String path, {
    String? token,
    bool auth = false,
    Map<String, dynamic>? body,
  }) async {
    String? effectiveToken = token;
    if (auth && (token == null || token.isEmpty)) {
      effectiveToken = await getToken();
    }

    final res = await http.put(
      path.startsWith('http') ? Uri.parse(path) : _uri(path),
      headers: _headers(token: effectiveToken),
      body: jsonEncode(body ?? const {}),
    );
    if (res.statusCode >= 200 && res.statusCode < 300) return _decodeBody(res);
    throw _httpError(res);
  }

  static Future<dynamic> delete(
    String path, {
    String? token,
    bool auth = false,
  }) async {
    String? effectiveToken = token;
    if (auth && (token == null || token.isEmpty)) {
      effectiveToken = await getToken();
    }

    final res = await http.delete(
      path.startsWith('http') ? Uri.parse(path) : _uri(path),
      headers: _headers(token: effectiveToken),
    );
    if (res.statusCode >= 200 && res.statusCode < 300) return _decodeBody(res);
    throw _httpError(res);
  }
}
