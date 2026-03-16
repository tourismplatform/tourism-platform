class ApiConstants {
  static const String baseUrl = "http://localhost:3001/api"; // Localhost for Linux/Desktop
  // static const String baseUrl = "http://10.0.2.2:3001/api"; // Android émulateur
  // static const String baseUrl = "https://ton-domaine.com/api"; // Production

  // Auth
  static const String register = "/auth/register";
  static const String login = "/auth/login";
  static const String me = "/auth/me";

  // Destinations
  static const String destinations = "/destinations";

  // Bookings
  static const String bookings = "/bookings";
  static const String myBookings = "/bookings/my";

  // Payments
  static String payment(String bookingId) => "/payments/$bookingId";

  // Reviews
  static const String reviews = "/reviews";

  // Admin
  static const String adminStats = "/admin/stats";
  static const String adminDestinations = "/admin/destinations";
  static const String adminBookings = "/admin/bookings";
}