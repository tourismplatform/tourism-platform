import '../constants/api_constants.dart';
import 'api_service.dart';

class DestinationService {
  static Future<List<dynamic>> getDestinations() async {
    final response = await ApiService.get(ApiConstants.destinations);
    if (response is Map && response.containsKey('data')) {
      return response['data'];
    }
    return response as List<dynamic>;
  }

  static Future<Map<String, dynamic>> getDestination(String id) async {
    final response = await ApiService.get('${ApiConstants.destinations}/$id');
    if (response is Map && response.containsKey('data')) {
      return response['data'];
    }
    return response as Map<String, dynamic>;
  }
}