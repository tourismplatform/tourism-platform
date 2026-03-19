import '../constants/api_constants.dart';
import 'api_service.dart';

class ReviewService {
  static Future<dynamic> addReview(Map<String, dynamic> data) async {
    return await ApiService.post(ApiConstants.reviews, body: data, auth: true);
  }
}
