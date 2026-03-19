import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'constants/index.dart';
import 'providers/index.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/user/index.dart';
import 'screens/user/settings_screen.dart';

import 'services/test_connection.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  testBackendConnection();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) {
            final p = AuthProvider();
            p.loadSession();
            return p;
          },
        ),
        ChangeNotifierProvider(create: (_) => DestinationProvider()),
        ChangeNotifierProvider(create: (_) => ReservationProvider()),
        ChangeNotifierProvider(create: (_) => ReviewProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp(
            title: 'Faso Explorer',
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
            debugShowCheckedModeBanner: false,
            initialRoute: '/',
            routes: {
              '/': (context) => const SplashScreen(),
              '/login': (context) => const LoginScreen(),
              '/register': (context) => const RegisterScreen(),
              '/home': (context) {
                final args = ModalRoute.of(context)?.settings.arguments;
                int initialTab = 0;
                int initialReservationTab = 0;
                if (args is Map<String, dynamic>) {
                  if (args['tab'] is int) initialTab = args['tab'] as int;
                  if (args['reservationTab'] is int) initialReservationTab = args['reservationTab'] as int;
                }
                return MainUserScreen(initialTab: initialTab, initialReservationTab: initialReservationTab);
              },
              '/destinations-list': (context) => const DestinationsListScreen(),
              '/destination-detail': (context) {
                final args = ModalRoute.of(context)!.settings.arguments;
                if (args is Map<String, dynamic>) {
                  return DestinationDetailScreen(
                    destinationId: args['id'] as String,
                    showReservation: args['showReservation'] as bool? ?? true,
                  );
                }
                return DestinationDetailScreen(destinationId: args as String);
              },
              '/reservation': (context) {
                final destinationId = ModalRoute.of(context)!.settings.arguments as String;
                return BookingPage(destinationId: destinationId);
              },
              // '/payment': (context) {
              //   final reservationData = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
              //   return PaymentScreen(reservationData: reservationData);
              // },
              '/my-reservations': (context) => const MyReservationsScreen(),
              '/settings': (context) {
                final initialTab = ModalRoute.of(context)?.settings.arguments as String?;
                return SettingsScreen(initialTab: initialTab);
              },
            },
          );
        },
      ),
    );
  }
}

// Écran de démarrage des touristes (Splash Screen)
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
          Image.asset(
            'assets/images/pics_de_sindou.png',
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => Container(
              color: AppTheme.primaryColor,
            ),
          ),
          // Dark Overlay for readability
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withValues(alpha: 0.3),
                  Colors.black.withValues(alpha: 0.8),
                ],
              ),
            ),
          ),
          // Content
          FadeTransition(
            opacity: _fadeAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),
                Image.asset(
                  'assets/images/logo.png',
                  height: 120,
                  errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 16),
                Text(
                  'Faso Explorer',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 48,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Découvrez le Burkina Faso',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w400,
                    letterSpacing: 1.2,
                  ),
                ),
                const Spacer(),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 48),
                  child: SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      onPressed: () {
                        final authProvider = Provider.of<AuthProvider>(context, listen: false);
                        if (authProvider.isAuthenticated) {
                          Navigator.of(context).pushReplacementNamed('/home');
                        } else {
                          Navigator.of(context).pushReplacementNamed('/login');
                        }
                      },
                      child: const Text(
                        'Commencer l\'exploration',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Écran principal des touristes avec navigation
class MainUserScreen extends StatefulWidget {
  final int initialTab;
  final int initialReservationTab;
  const MainUserScreen({super.key, this.initialTab = 0, this.initialReservationTab = 0});

  @override
  State<MainUserScreen> createState() => _MainUserScreenState();
}

class _MainUserScreenState extends State<MainUserScreen> {
  late int _selectedIndex;
  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialTab;
    _screens = [
      const HomeScreen(),
      const DestinationsListScreen(),
      MyReservationsScreen(initialTabIndex: widget.initialReservationTab),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (int index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: const Icon(Icons.home),
            label: langProvider.translate('home'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.location_on_outlined),
            selectedIcon: const Icon(Icons.location_on),
            label: langProvider.translate('destinations'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.receipt_long_outlined),
            selectedIcon: const Icon(Icons.receipt),
            label: langProvider.translate('reservations'),
          ),
        ],
      ),
    );
  }
}

