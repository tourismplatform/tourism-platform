import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../providers/index.dart'; // Pour AuthProvider, LanguageProvider etc.
import '../../models/index.dart'; // Pour Reservation, ReservationStatus etc.
import '../../constants/constants.dart';
import '../../services/api_service.dart';

class BookingPage extends StatefulWidget {
  final String destinationId;

  const BookingPage({super.key, required this.destinationId});

  @override
  State<BookingPage> createState() => _BookingPageState();
}

class _BookingPageState extends State<BookingPage> {
  // Couleurs demandées
  static const Color primaryBlue = Color(0xFF1A4FD6);
  static const Color primaryGreen = Color(0xFF00875A);
  static const Color lightGrey = Color(0xFFE5E7EB);

  // État du stepper
  int _currentStep = 0;
  bool _isLoading = false;
  String? _error;
  String? _transactionId;
  String? _bookingId;

  // Données
  Map<String, dynamic>? _destinationData;
  late DateTime _checkIn;
  late DateTime _checkOut;
  int _nbPersons = 1;
  double _totalPrice = 0.0;
  String _paymentMethod = 'card'; // 'card' ou 'mobile_money'

  @override
  void initState() {
    super.initState();
    _checkIn = DateTime.now();
    _checkOut = DateTime.now().add(const Duration(days: 1));
    _checkAuthAndLoadData();
  }

  Future<void> _checkAuthAndLoadData() async {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (!authProvider.isAuthenticated) {
        // Redirection vers login si non connecté
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Veuillez vous connecter pour réserver')),
        );
        Navigator.of(context).pushReplacementNamed('/login');
        return;
      }
      await _fetchDestination();
    });
  }

  Future<void> _fetchDestination() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final json = await ApiService.get('/api/destinations/${widget.destinationId}');
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      if (data is Map<String, dynamic>) {
        _destinationData = data;
        _calculateTotal();
      } else {
        _error = 'Destination introuvable.';
      }
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _calculateTotal() {
    if (_destinationData != null) {
      final numDays = _checkOut.difference(_checkIn).inDays.abs() + 1;
      final pricePerPerson =
          (_destinationData!['price_per_person'] ?? _destinationData!['pricePerPerson'] ?? 0.0)
              .toDouble();
      _totalPrice = pricePerPerson * _nbPersons * numDays;
    }
  }

  Future<void> _selectStartDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _checkIn,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        _checkIn = picked;
        if (_checkOut.isBefore(_checkIn)) {
          _checkOut = _checkIn.add(const Duration(days: 1));
        }
        _calculateTotal();
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _checkOut,
      firstDate: _checkIn,
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        _checkOut = picked;
        _calculateTotal();
      });
    }
  }

  Future<void> _submitBookingAndPayment() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      if (!mounted) return;
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final reservationProvider = Provider.of<ReservationProvider>(context, listen: false);
      
      final currentUserId = authProvider.currentUser?.id ?? '';
      final destName = (_destinationData?['name'] ?? 'Destination').toString();

      final draft = Reservation(
        id: '',
        userId: currentUserId,
        destinationId: widget.destinationId,
        destinationName: destName,
        startDate: _checkIn,
        endDate: _checkOut,
        numberOfPeople: _nbPersons,
        totalPrice: _totalPrice,
        status: ReservationStatus.pending,
        createdAt: DateTime.now(),
      );

      final created = await reservationProvider.createReservation(draft);
      if (created == null) {
        throw Exception(reservationProvider.error ?? 'Réservation échouée');
      }

      final token = await ApiService.getToken();
      if (token == null || token.isEmpty) {
        throw Exception('Veuillez vous connecter');
      }

      final paymentJson = await ApiService.post(
        paymentsProcessEndpoint,
        token: token,
        body: {'booking_id': created.id},
      );
      final paymentData = (paymentJson is Map<String, dynamic>) ? paymentJson['data'] : null;

      // 3. Mise à jour des états post-paiement
      if (!mounted) return;
      setState(() {
        _bookingId = created.id;
        // Le backend renvoie: data: { payment, transactionId }
        // On est tolérant sur le format pour éviter les erreurs selon les évolutions.
        final dynamic txnFromTopLevel =
            paymentData is Map<String, dynamic>
                ? (paymentData['transactionId'] ??
                    paymentData['transaction_id'])
                : null;
        final dynamic txnFromPaymentObject =
            (txnFromTopLevel == null &&
                    paymentData is Map<String, dynamic> &&
                    paymentData['payment'] is Map<String, dynamic>)
                ? ((paymentData['payment'] as Map<String, dynamic>)[
                    'transaction_id'] ??
                    (paymentData['payment'] as Map<String, dynamic>)[
                        'transactionId'])
                : null;
        _transactionId =
            (txnFromTopLevel ?? txnFromPaymentObject ?? '').toString();
        _currentStep = 2; // Passage à l'étape finale
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Réservation',
          style: GoogleFonts.poppins(color: Colors.black87, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: _isLoading && _currentStep == 0
          ? const Center(child: CircularProgressIndicator(color: primaryBlue))
          : Column(
              children: [
                _buildStepperHeader(),
                Expanded(
                  child: _error != null && _currentStep == 0
                      ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
                      : _buildCurrentStepContent(),
                ),
              ],
            ),
    );
  }

  /// Étape 1 : Récapitulatif et saisie des informations
  Widget _buildStep1() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Récapitulatif destination
          if (_destinationData != null)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(color: lightGrey, blurRadius: 10, offset: const Offset(0, 4)),
                ],
                border: Border.all(color: lightGrey),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    (_destinationData!['name'] ?? '').toString(),
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: primaryBlue,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        (_destinationData!['location'] ?? '').toString(),
                        style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[700]),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          const SizedBox(height: 24),
          Text(
            'Détails du séjour',
            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          // Dates
          Row(
            children: [
              Expanded(
                child: _buildDatePicker(
                  label: 'Arrivée',
                  date: _checkIn,
                  onTap: () => _selectStartDate(context),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildDatePicker(
                  label: 'Départ',
                  date: _checkOut,
                  onTap: () => _selectEndDate(context),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Personnes
          Text(
            'Nombre de personnes',
            style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              border: Border.all(color: lightGrey),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.remove_circle_outline, color: primaryBlue),
                  onPressed: () {
                    if (_nbPersons > 1) {
                      setState(() {
                        _nbPersons--;
                        _calculateTotal();
                      });
                    }
                  },
                ),
                Text(
                  '$_nbPersons',
                  style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline, color: primaryBlue),
                  onPressed: () {
                    setState(() {
                      _nbPersons++;
                      _calculateTotal();
                    });
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          // Total
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: primaryBlue.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: primaryBlue.withValues(alpha: 0.2)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Prix Total',
                  style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${_totalPrice.toStringAsFixed(0)} CFA',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: primaryBlue,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryBlue,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                setState(() {
                  _currentStep = 1;
                });
              },
              child: Text(
                'Continuer vers paiement',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Étape 2 : Choix du paiement
  Widget _buildStep2() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: primaryGreen.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: primaryGreen.withValues(alpha: 0.2)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Montant à payer',
                  style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
                ),
                Text(
                  '${_totalPrice.toStringAsFixed(0)} CFA',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: primaryGreen,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Mode de paiement',
            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          // Option Carte
          _buildPaymentOption(
            title: 'Carte bancaire',
            icon: Icons.credit_card,
            value: 'card',
          ),
          const SizedBox(height: 12),
          // Option Mobile Money
          _buildPaymentOption(
            title: 'Mobile Money',
            icon: Icons.phone_android,
            value: 'mobile_money',
          ),
          const SizedBox(height: 30),
          
          if (_error != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(
                _error!,
                style: const TextStyle(color: Colors.red),
              ),
            ),
            
          Row(
            children: [
              Expanded(
                child: TextButton(
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: lightGrey),
                    ),
                  ),
                  onPressed: _isLoading ? null : () {
                    setState(() {
                      _currentStep = 0;
                    });
                  },
                  child: Text(
                    'Retour',
                    style: GoogleFonts.poppins(
                      color: Colors.grey[800],
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryGreen,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: _isLoading ? null : _submitBookingAndPayment,
                  child: _isLoading 
                      ? const SizedBox(
                          height: 20, 
                          width: 20, 
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                        )
                      : Text(
                          'Confirmer paiement',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Étape 3 : Confirmation
  Widget _buildStep3() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(30.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: primaryGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle,
              color: primaryGreen,
              size: 80,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Paiement effectué avec succès !',
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            'Votre réservation est en attente de confirmation administrative.',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey[700],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 30),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: lightGrey.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: lightGrey),
            ),
            child: Column(
              children: [
                _buildInfoRow('ID Réservation', _bookingId ?? '-'),
                const Divider(),
                _buildInfoRow('N° Transaction', _transactionId ?? '-'),
              ],
            ),
          ),
          const SizedBox(height: 40),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryBlue,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                // Retour à l'accueil sur l'onglet Réservations (index 2 = icône réservations)
                // On passe aussi initialReservationTab=0 pour afficher "En attente"
                Navigator.of(context).pushNamedAndRemoveUntil(
                  '/home',
                  (route) => false,
                  arguments: {'tab': 2, 'reservationTab': 0},
                );
              },
              child: Text(
                'Voir Mes Réservations',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: lightGrey),
                ),
              ),
              onPressed: () {
                // Retour Accueil
                Navigator.of(context).pushNamedAndRemoveUntil('/home', (route) => false);
              },
              child: Text(
                'Retour à l\'Accueil',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[800],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Composants utilitaires pour la vue

  Widget _buildPaymentOption({required String title, required IconData icon, required String value}) {
    final isSelected = _paymentMethod == value;
    return GestureDetector(
      onTap: () {
        setState(() {
          _paymentMethod = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? primaryBlue.withValues(alpha: 0.05) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? primaryBlue : lightGrey,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? primaryBlue : Colors.grey[600]),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected ? primaryBlue : Colors.black87,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: primaryBlue),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[700]),
          ),
          Text(
            value,
            style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildDatePicker({required String label, required DateTime date, required VoidCallback onTap}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            decoration: BoxDecoration(
              border: Border.all(color: lightGrey),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  DateFormat('dd/MM/yyyy').format(date),
                  style: GoogleFonts.poppins(fontSize: 14),
                ),
                const Icon(Icons.calendar_month, color: primaryBlue, size: 20),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCurrentStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildStep1();
      case 1:
        return _buildStep2();
      case 2:
        return _buildStep3();
      default:
        return const SizedBox();
    }
  }

  /// Stepper horizontal customisé
  Widget _buildStepperHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 30),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: lightGrey)),
      ),
      child: Row(
        children: [
          _buildStepCircle(0, 'Infos'),
          _buildStepLine(0),
          _buildStepCircle(1, 'Paiement'),
          _buildStepLine(1),
          _buildStepCircle(2, 'Succès'),
        ],
      ),
    );
  }

  Widget _buildStepCircle(int stepIndex, String title) {
    final isActive = _currentStep == stepIndex;
    final isPassed = _currentStep > stepIndex;
    
    Color circleColor;
    if (isPassed) {
      circleColor = primaryGreen;
    } else if (isActive) {
      circleColor = primaryBlue;
    } else {
      circleColor = lightGrey;
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: circleColor,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: isPassed
                ? const Icon(Icons.check, color: Colors.white, size: 18)
                : Text(
                    '${stepIndex + 1}',
                    style: GoogleFonts.poppins(
                      color: isActive ? Colors.white : Colors.grey[600],
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: isActive || isPassed ? FontWeight.bold : FontWeight.w500,
            color: isActive || isPassed ? Colors.black87 : Colors.grey[500],
          ),
        ),
      ],
    );
  }

  Widget _buildStepLine(int stepIndex) {
    final isPassed = _currentStep > stepIndex;
    return Expanded(
      child: Container(
        height: 2,
        color: isPassed ? primaryGreen : lightGrey,
      ),
    );
  }
}
