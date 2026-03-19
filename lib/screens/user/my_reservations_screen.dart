import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../models/index.dart';
import '../../providers/index.dart';
import '../../widgets/index.dart';

class MyReservationsScreen extends StatefulWidget {
  final int initialTabIndex;
  const MyReservationsScreen({super.key, this.initialTabIndex = 0});

  @override
  State<MyReservationsScreen> createState() => _MyReservationsScreenState();
}

class _MyReservationsScreenState extends State<MyReservationsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 4,
      vsync: this,
      initialIndex: widget.initialTabIndex.clamp(0, 3),
    );
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.currentUser?.id ?? '';
      Provider.of<ReservationProvider>(context, listen: false)
          .loadReservations(userId);
    });
  }

  @override
  void didUpdateWidget(MyReservationsScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialTabIndex != widget.initialTabIndex) {
      _tabController.animateTo(widget.initialTabIndex.clamp(0, 3));
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.currentUser?.id ?? '';

    return Consumer<ReservationProvider>(
      builder: (context, provider, _) {
        // Filtrer les réservations de l'utilisateur courant
        final userReservations = userId.isEmpty
            ? provider.reservations
            : provider.getReservationsForUser(userId);

        final pendingLength =
            userReservations.where((r) => r.status == ReservationStatus.pending).length;
        final confirmedLength =
            userReservations.where((r) => r.status == ReservationStatus.confirmed).length;
        final completedLength =
            userReservations.where((r) => r.status == ReservationStatus.completed).length;
        final cancelledLength =
            userReservations.where((r) => r.status == ReservationStatus.cancelled).length;

        return Scaffold(
          drawer: const AppDrawer(),
          appBar: AppBar(
            title: Text(langProvider.translate('my_reservations')),
            bottom: TabBar(
              controller: _tabController,
              tabs: [
                Tab(text: '${langProvider.translate('pending_status')} ($pendingLength)'),
                Tab(text: '${langProvider.translate('confirmed_status')} ($confirmedLength)'),
                Tab(text: '${langProvider.translate('completed_status')} ($completedLength)'),
                Tab(text: '${langProvider.translate('cancelled_status')} ($cancelledLength)'),
              ],
            ),
          ),
          body: provider.isLoading
              ? const Center(child: CircularProgressIndicator())
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildReservationsList(
                        userReservations, ReservationStatus.pending, langProvider),
                    _buildReservationsList(
                        userReservations, ReservationStatus.confirmed, langProvider),
                    _buildReservationsList(
                        userReservations, ReservationStatus.completed, langProvider),
                    _buildReservationsList(
                        userReservations, ReservationStatus.cancelled, langProvider),
                  ],
                ),
        );
      },
    );
  }

  Widget _buildReservationsList(List<Reservation> allReservations,
      ReservationStatus status, LanguageProvider langProvider) {
    final reservations =
        allReservations.where((r) => r.status == status).toList();

    if (reservations.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.travel_explore, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              langProvider.translate('no_reservations'),
              style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: reservations.length,
      itemBuilder: (context, index) {
        final reservation = reservations[index];
        return _buildReservationCard(reservation, langProvider);
      },
    );
  }

  Widget _buildReservationCard(
      Reservation reservation, LanguageProvider langProvider) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // En-tête avec titre et statut
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    reservation.destinationName,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                _buildStatusChip(reservation.status, langProvider),
              ],
            ),
            const SizedBox(height: 12),
            // Dates
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  '${DateFormat('dd/MM').format(reservation.startDate)} - ${DateFormat('dd/MM/yyyy').format(reservation.endDate)}',
                  style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // Nombre de personnes
            Row(
              children: [
                const Icon(Icons.people, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  '${reservation.numberOfPeople} ${langProvider.translate('persons')} - ${reservation.numberOfDays} ${langProvider.translate('days')}',
                  style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(),
            const SizedBox(height: 12),
            // Prix et actions
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${reservation.totalPrice.toStringAsFixed(0)} CFA',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                Row(
                  children: [
                    if (reservation.status == ReservationStatus.completed)
                      ElevatedButton.icon(
                        onPressed: () =>
                            _showReviewDialog(reservation, langProvider),
                        icon: const Icon(Icons.rate_review, size: 16),
                        label: Text(langProvider.translate('review')),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
                      ),
                    if (reservation.status == ReservationStatus.pending)
                      ElevatedButton.icon(
                        onPressed: () =>
                            _cancelReservation(reservation.id, langProvider),
                        icon: const Icon(Icons.close, size: 16),
                        label: Text(langProvider.translate('cancel')),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          backgroundColor: Colors.red,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(
      ReservationStatus status, LanguageProvider langProvider) {
    Color backgroundColor;
    Color textColor;
    String label;

    switch (status) {
      case ReservationStatus.pending:
        backgroundColor = Colors.orange[100]!;
        textColor = Colors.orange[900]!;
        label = langProvider.translate('pending_status');
        break;
      case ReservationStatus.confirmed:
        backgroundColor = Colors.green[100]!;
        textColor = Colors.green[900]!;
        label = langProvider.translate('confirmed_status');
        break;
      case ReservationStatus.cancelled:
        backgroundColor = Colors.red[100]!;
        textColor = Colors.red[900]!;
        label = langProvider.translate('cancelled_status');
        break;
      case ReservationStatus.completed:
        backgroundColor = Colors.blue[100]!;
        textColor = Colors.blue[900]!;
        label = 'Terminé';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: GoogleFonts.poppins(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: textColor,
        ),
      ),
    );
  }

  void _showReviewDialog(
      Reservation reservation, LanguageProvider langProvider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return ReviewDialogWidget(
          reservation: reservation,
          onSubmit: (rating, comment) {
            Navigator.pop(context);
            _submitReview(reservation, rating, comment, langProvider);
          },
        );
      },
    );
  }

  Future<void> _submitReview(
    Reservation reservation,
    int rating,
    String comment,
    LanguageProvider langProvider,
  ) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final user = authProvider.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(langProvider.translate('welcome_login'))),
      );
      return;
    }

    final reviewProvider = Provider.of<ReviewProvider>(context, listen: false);
    await reviewProvider.addReview(
      Review(
        id: '',
        destinationId: reservation.destinationId,
        userId: user.id,
        userName: user.fullName,
        rating: rating,
        comment: comment,
        createdAt: DateTime.now(),
      ),
    );

    if (!mounted) return;

    if (reviewProvider.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(reviewProvider.error!)),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(langProvider.translate('review_added_success'))),
    );
  }

  void _cancelReservation(String id, LanguageProvider langProvider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(langProvider.translate('confirm_cancellation')),
          content: Text(
            langProvider.translate('cancel_reservation_confirmation'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(langProvider.translate('no')),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _performCancelReservation(id, langProvider);
              },
              child: Text(langProvider.translate('yes'),
                  style: const TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  Future<void> _performCancelReservation(
    String reservationId,
    LanguageProvider langProvider,
  ) async {
    final reservationProvider =
        Provider.of<ReservationProvider>(context, listen: false);
    final ok = await reservationProvider.cancelReservation(reservationId);

    if (!mounted) return;

    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(langProvider.translate('reservation_cancelled'))),
      );
      return;
    }

    final err = reservationProvider.error;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(err ?? langProvider.translate('reservation_cancelled'))),
    );
  }
}

class ReviewDialogWidget extends StatefulWidget {
  final Reservation reservation;
  final Function(int, String) onSubmit;

  const ReviewDialogWidget({
    super.key,
    required this.reservation,
    required this.onSubmit,
  });

  @override
  State<ReviewDialogWidget> createState() => _ReviewDialogWidgetState();
}

class _ReviewDialogWidgetState extends State<ReviewDialogWidget> {
  int _rating = 0;
  final TextEditingController _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(
        'Laisser un avis',
        style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.reservation.destinationName,
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          Text('Note', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Row(
            children: List.generate(5, (index) {
              return GestureDetector(
                onTap: () => setState(() => _rating = index + 1),
                child: Icon(
                  index < _rating ? Icons.star : Icons.star_border,
                  color: Colors.amber,
                  size: 32,
                ),
              );
            }),
          ),
          const SizedBox(height: 16),
          Text(
            'Commentaire',
            style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _commentController,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Partagez votre expérience...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Annuler'),
        ),
        ElevatedButton(
          onPressed: _rating > 0
              ? () {
                  widget.onSubmit(_rating, _commentController.text);
                }
              : null,
          child: const Text('Envoyer'),
        ),
      ],
    );
  }
}
