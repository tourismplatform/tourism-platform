import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../models/index.dart';
import '../../providers/index.dart';
import '../../widgets/index.dart';

class MyReservationsScreen extends StatefulWidget {
  const MyReservationsScreen({super.key});

  @override
  State<MyReservationsScreen> createState() => _MyReservationsScreenState();
}

class _MyReservationsScreenState extends State<MyReservationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ReservationProvider>(context, listen: false).loadReservations('current_user_id');
    });
  }

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);
    return Consumer<ReservationProvider>(
      builder: (context, provider, _) {
        final pendingLength = provider.reservations.where((r) => r.status == ReservationStatus.pending).length;
        final confirmedLength = provider.reservations.where((r) => r.status == ReservationStatus.confirmed).length;
        final cancelledLength = provider.reservations.where((r) => r.status == ReservationStatus.cancelled).length;

        return DefaultTabController(
          length: 3,
          child: Scaffold(
            drawer: const AppDrawer(),
            appBar: AppBar(
              title: Text(langProvider.translate('my_reservations')),
              bottom: TabBar(
                tabs: [
                  Tab(text: '${langProvider.translate('pending_status')} ($pendingLength)'),
                  Tab(text: '${langProvider.translate('confirmed_status')} ($confirmedLength)'),
                  Tab(text: '${langProvider.translate('cancelled_status')} ($cancelledLength)'),
                ],
              ),
            ),
            body: provider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : TabBarView(
                    children: [
                      _buildReservationsList(provider.reservations, ReservationStatus.pending, langProvider),
                      _buildReservationsList(provider.reservations, ReservationStatus.confirmed, langProvider),
                      _buildReservationsList(provider.reservations, ReservationStatus.cancelled, langProvider),
                    ],
                  ),
          ),
        );
      },
    );
  }

  Widget _buildReservationsList(List<Reservation> allReservations, ReservationStatus status, LanguageProvider langProvider) {
    final reservations = allReservations.where((r) => r.status == status).toList();

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

  Widget _buildReservationCard(Reservation reservation, LanguageProvider langProvider) {
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
            // Divider
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
                    if (reservation.status == ReservationStatus.confirmed)
                      ElevatedButton.icon(
                        onPressed: () => _showReviewDialog(reservation, langProvider),
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
                        onPressed: () => _cancelReservation(reservation.id, langProvider),
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

  Widget _buildStatusChip(ReservationStatus status, LanguageProvider langProvider) {
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

  void _showReviewDialog(Reservation reservation, LanguageProvider langProvider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return ReviewDialogWidget(
          reservation: reservation,
          onSubmit: (rating, comment) {
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(langProvider.translate('review_added_success'))),
            );
          },
        );
      },
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
                Provider.of<ReservationProvider>(context, listen: false)
                    .cancelReservation(id)
                    .then((_) {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(langProvider.translate('reservation_cancelled'))),
                  );
                });
              },
              child: Text(langProvider.translate('yes'), style: const TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
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
