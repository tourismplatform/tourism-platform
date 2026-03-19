import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../models/index.dart';
import '../../providers/index.dart';
import '../../widgets/smart_image_loader.dart';

class DestinationDetailScreen extends StatelessWidget {
  final String destinationId;
  final bool showReservation;

  const DestinationDetailScreen({
    super.key,
    required this.destinationId,
    this.showReservation = true,
  });

  Color _categoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'culture':
        return const Color(0xFF6B3A2A);
      case 'aventure':
        return const Color(0xFF1B5E3B);
      case 'nature':
        return const Color(0xFF1A6B4A);
      default:
        return const Color(0xFF2C3E6B);
    }
  }

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      body: Consumer<DestinationProvider>(
        builder: (context, destinationProvider, _) {
          final destination = destinationProvider.getDestinationById(
            destinationId,
          );

          if (destination == null) {
            return Scaffold(
              appBar: AppBar(title: Text(langProvider.translate('details'))),
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.location_off_rounded,
                      size: 64,
                      color: Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      langProvider.translate('destination_not_found'),
                      style: GoogleFonts.poppins(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            );
          }

          final color = _categoryColor(destination.category);

          return CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // ── AppBar avec image héros ───────────────────────────
              SliverAppBar(
                expandedHeight: 320,
                pinned: true,
                backgroundColor: color,
                foregroundColor: Colors.white,
                actions: [
                  IconButton(
                    icon: const Icon(Icons.favorite_border_rounded),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            langProvider.translate('added_favorites'),
                            style: GoogleFonts.poppins(),
                          ),
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          backgroundColor: color,
                        ),
                      );
                    },
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Image héros du site
                      if (destination.imageUrls.isNotEmpty)
                        SmartImageLoader(
                          imageUrl: destination.imageUrl,
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                        )
                      else
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [color, color.withValues(alpha: 0.7)],
                            ),
                          ),
                        ),
                      // Gradient sombre en bas
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.65),
                            ],
                          ),
                        ),
                      ),
                      // Nom + catégorie en bas de l'image
                      Positioned(
                        bottom: 20,
                        left: 20,
                        right: 20,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 5,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.22),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.35),
                                ),
                              ),
                              child: Text(
                                destination.category,
                                style: GoogleFonts.poppins(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              destination.name,
                              style: GoogleFonts.poppins(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                height: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // ── Corps ─────────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Note + prix
                      _buildRatingPriceRow(destination, color),
                      const SizedBox(height: 16),

                      // Afficher la localisation s'il n'y a PAS de réservation
                      if (!showReservation) ...[
                        _buildLocationCard(context, destination, color),
                        const SizedBox(height: 16),
                      ],

                      // Description et infos pratiques SEULEMENT si ce n'est PAS depuis l'accueil (Accueil = showReservation = true)
                      if (!showReservation) ...[
                        _buildDescriptionCard(destination, langProvider),
                        const SizedBox(height: 16),
                        _buildInfoCard(destination, color, langProvider),
                        const SizedBox(height: 100),
                      ] else ...[
                        const SizedBox(height: 100),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),

      // ── Bouton de réservation (uniquement si showReservation) ───
      bottomNavigationBar: showReservation
          ? Consumer<DestinationProvider>(
              builder: (context, provider, _) {
                final destination = provider.getDestinationById(destinationId);
                if (destination == null) return const SizedBox.shrink();
                final color = _categoryColor(destination.category);
                final langProvider = Provider.of<LanguageProvider>(
                  context,
                  listen: false,
                );

                return Container(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 16,
                        offset: const Offset(0, -4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      // Prix
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'À partir de',
                            style: GoogleFonts.poppins(
                              fontSize: 11,
                              color: Colors.grey[500],
                            ),
                          ),
                          Text(
                            destination.pricePerPerson == 0
                                ? 'Gratuit'
                                : '${destination.pricePerPerson.toStringAsFixed(0)} CFA',
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: color,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      // Bouton Réserver
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: color,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 0,
                          ),
                          onPressed: () => Navigator.of(
                            context,
                          ).pushNamed('/reservation', arguments: destinationId),
                          child: Text(
                            langProvider.translate('book_now'),
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            )
          : null,
    );
  }

  // ── Note + prix ───────────────────────────────────────────────────────
  Widget _buildRatingPriceRow(Destination destination, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          ...List.generate(5, (i) {
            final full = i < destination.rating.floor();
            final half =
                !full &&
                i < destination.rating &&
                destination.rating - i >= 0.5;
            return Icon(
              full
                  ? Icons.star_rounded
                  : half
                  ? Icons.star_half_rounded
                  : Icons.star_outline_rounded,
              color: Colors.amber,
              size: 20,
            );
          }),
          const SizedBox(width: 8),
          Text(
            '${destination.rating}',
            style: GoogleFonts.poppins(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A237E),
            ),
          ),
          Text(
            '  (${destination.numberOfReviews} avis)',
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[500]),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              destination.pricePerPerson == 0
                  ? 'Gratuit'
                  : '${destination.pricePerPerson.toStringAsFixed(0)} CFA',
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Localisation (uniquement si !showReservation) ───────────────────
  Widget _buildLocationCard(
    BuildContext context,
    Destination destination,
    Color color,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.location_on_rounded,
                    color: color,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  '📍 Localisation',
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF1A237E),
                  ),
                ),
              ],
            ),
          ),
          // Carte visuelle
          Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 0),
            height: 140,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  color.withValues(alpha: 0.85),
                  color.withValues(alpha: 0.55),
                ],
              ),
            ),
            child: Stack(
              children: [
                CustomPaint(painter: _MapGridPainter(), child: Container()),
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.2),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.location_on_rounded,
                          color: color,
                          size: 24,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          destination.name,
                          style: GoogleFonts.poppins(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: color,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Adresse + bouton copier
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.place_rounded, color: color, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        destination.location,
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF1A237E),
                        ),
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        Clipboard.setData(
                          ClipboardData(text: destination.location),
                        );
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Localisation copiée !',
                              style: GoogleFonts.poppins(),
                            ),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: color,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        );
                      },
                      child: Icon(
                        Icons.copy_rounded,
                        color: Colors.grey[400],
                        size: 18,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.flag_rounded, color: color, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      'Burkina Faso',
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Description ───────────────────────────────────────────────────────
  Widget _buildDescriptionCard(
    Destination destination,
    LanguageProvider langProvider,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '📝 ${langProvider.translate('description')}',
            style: GoogleFonts.poppins(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A237E),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            destination.description,
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey[700],
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  // ── Informations pratiques ────────────────────────────────────────────
  Widget _buildInfoCard(
    Destination destination,
    Color color,
    LanguageProvider langProvider,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '🔎 Informations pratiques',
            style: GoogleFonts.poppins(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A237E),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _infoTile(
                  Icons.star_rounded,
                  'Note',
                  '${destination.rating}/5',
                  Colors.amber[700]!,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _infoTile(
                  Icons.people_rounded,
                  'Avis',
                  '${destination.numberOfReviews}',
                  color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _infoTile(
                  Icons.payments_rounded,
                  'Entrée',
                  destination.pricePerPerson == 0
                      ? 'Gratuit'
                      : '${destination.pricePerPerson.toStringAsFixed(0)} CFA',
                  const Color(0xFF17C37B),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _infoTile(
                  Icons.category_rounded,
                  'Type',
                  destination.category,
                  color,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoTile(IconData icon, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 6),
          Text(
            label,
            style: GoogleFonts.poppins(fontSize: 10, color: Colors.grey[500]),
          ),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A237E),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Peintre de grille carte ───────────────────────────────────────────
class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.12)
      ..strokeWidth = 1;
    for (double y = 0; y < size.height; y += 25) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
    for (double x = 0; x < size.width; x += 25) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    final center = Offset(size.width / 2, size.height / 2);
    final cp = Paint()
      ..color = Colors.white.withValues(alpha: 0.07)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    for (double r = 25; r < 100; r += 25) {
      canvas.drawCircle(center, r, cp);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}
