import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';

/// Widget professionnel pour afficher les images avec gestion robuste
class ProfessionalImageLoader extends StatefulWidget {
  final String imageUrl;
  final double width;
  final double height;
  final BoxFit fit;
  final String destinationId;
  final VoidCallback? onRetry;

  const ProfessionalImageLoader({
    super.key,
    required this.imageUrl,
    required this.destinationId,
    this.width = double.infinity,
    this.height = double.infinity,
    this.fit = BoxFit.cover,
    this.onRetry,
  });

  @override
  State<ProfessionalImageLoader> createState() =>
      _ProfessionalImageLoaderState();
}

class _ProfessionalImageLoaderState extends State<ProfessionalImageLoader> {
  late String _validatedUrl;

  @override
  void initState() {
    super.initState();
    _validatedUrl = _validateAndOptimizeUrl(widget.imageUrl);
  }

  String _validateAndOptimizeUrl(String url) {
    // Vérifier que l'URL est valide
    if (url.isEmpty) {
      return 'https://via.placeholder.com/400x300?text=Image+Non+Disponible';
    }

    // Vérifier que c'est HTTPS
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return 'https://via.placeholder.com/400x300?text=Image+Non+Disponible';
    }

    // Pexels URLs - ajouter paramètres si manquants
    if (url.contains('pexels.com')) {
      if (!url.contains('?')) {
        return '$url?auto=compress&cs=tinysrgb&w=600';
      }
    }

    return url;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: _buildImage(),
    );
  }

  Widget _buildImage() {
    return CachedNetworkImage(
      imageUrl: _validatedUrl,
      fit: widget.fit,
      width: widget.width,
      height: widget.height,
      cacheKey: 'img_${widget.destinationId}_${_validatedUrl.hashCode}',
      maxHeightDiskCache: 800,
      maxWidthDiskCache: 800,
      fadeInDuration: const Duration(milliseconds: 500),
      fadeOutDuration: const Duration(milliseconds: 300),
      progressIndicatorBuilder: (context, url, progress) {
        return _buildLoadingWidget(progress.progress ?? 0.0);
      },
      errorWidget: (context, url, error) {
        return _buildErrorWidget();
      },
    );
  }

  Widget _buildLoadingWidget(double progress) {
    return Container(
      width: widget.width,
      height: widget.height,
      color: Colors.grey[200],
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 50,
            height: 50,
            child: CircularProgressIndicator(
              value: progress > 0 ? progress : null,
              strokeWidth: 3,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Chargement de l\'image...',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          if (progress > 0)
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                '${(progress * 100).toStringAsFixed(0)}%',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      width: widget.width,
      height: widget.height,
      color: Colors.grey[100],
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.image_not_supported_outlined,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Impossible de charger l\'image',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey[700],
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Vérifiez votre connexion internet',
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[500]),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          if (widget.onRetry != null)
            GestureDetector(
              onTap: widget.onRetry,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Réessayer',
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
