import 'package:flutter/foundation.dart';
import 'api_service.dart';
import '../constants/api_constants.dart';

Future<void> testBackendConnection() async {
  if (kDebugMode) {
    print('--- DÉBUT TEST CONNEXION BACKEND ---');
    print('Tentative de connexion à : ${ApiConstants.baseUrl}');
  }

  try {
    // On essaie de récupérer les destinations (endpoint public normalement)
    final response = await ApiService.get(ApiConstants.destinations);
    
    if (kDebugMode) {
      print('✅ Connexion au backend réussie !');
      print('Réponse reçue : ${response.toString().substring(0, response.toString().length > 100 ? 100 : response.toString().length)}...');
    }
  } catch (e) {
    if (kDebugMode) {
      print('❌ ÉCHEC de la connexion au backend.');
      print('Erreur : $e');
      print('\nCONSEILS :');
      print('1. Vérifiez que votre serveur NestJS est lancé sur le port 3001.');
      print('2. Si sur Android, vérifiez que l\'URL est http://10.0.2.2:3001/api');
      print('3. Assurez-vous que le pare-feu de votre machine ne bloque pas les connexions entrantes.');
    }
  } finally {
    if (kDebugMode) {
      print('--- FIN TEST CONNEXION BACKEND ---');
    }
  }
}
