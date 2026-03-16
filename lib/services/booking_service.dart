import '../constants/api_constants.dart';
import 'api_service.dart';

class BookingService {
  static Future<dynamic> createBooking(Map<String, dynamic> data) async {
    return await ApiService.post(ApiConstants.bookings, data, auth: true);
  }

  static Future<List<dynamic>> getMyBookings() async {
    return await ApiService.get(ApiConstants.myBookings, auth: true);
  }

  static Future<dynamic> payBooking(String bookingId) async {
    return await ApiService.post(
      ApiConstants.payment(bookingId), {}, auth: true);
  }
}