const String appName = 'ExplorerBF';
const String appSubtitle = 'Découvrez le Burkina Faso';

// Categories
const List<String> categories = ['Culture', 'Aventure', 'Nature'];

// API endpoints (NestJS backend)
// Important: sur téléphone Android réel, utilisez l'IP du PC (pas localhost).
const String apiBaseUrl = 'http://192.168.100.19:3001';
const String destinationsEndpoint = '/api/destinations';
const String bookingsMyEndpoint = '/api/bookings/my';
const String bookingsEndpoint = '/api/bookings';
const String authLoginEndpoint = '/api/auth/login';
const String authRegisterEndpoint = '/api/auth/register';
const String authMeEndpoint = '/api/auth/me';
const String reviewsEndpoint = '/api/reviews';
const String paymentsProcessEndpoint = '/api/payments/process';
const String paymentsStatusEndpoint = '/api/payments';

// Image settings
const Duration imageLoadTimeout = Duration(seconds: 15);
const String defaultPlaceholder =
    'https://via.placeholder.com/400x300?text=Image+Non+Disponible';
