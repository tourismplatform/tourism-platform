import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Service pour gérer le chargement et l'affichage des images
/// Fournit des widgets réutilisables et de la gestion des erreurs
class ImageService {
  /// Image par défaut si l'URL est vide
  static const String defaultPlaceholder =
      'https://via.placeholder.com/400x300?text=Image+Non+Disponible';

  /// Crée un widget d'image optimisé avec gestion d'erreurs
  static Widget buildCachedImage({
    required String imageUrl,
    required BoxFit fit,
    String? cacheKey,
    double? height,
    double? width,
    VoidCallback? onRetry,
  }) {
    final finalUrl = imageUrl.isEmpty || imageUrl == ''
        ? defaultPlaceholder
        : imageUrl;

    return CachedNetworkImage(
      imageUrl: finalUrl,
      fit: fit,
      cacheKey: cacheKey ?? finalUrl.hashCode.toString(),
      maxHeightDiskCache: 800,
      maxWidthDiskCache: 800,
      fadeInDuration: const Duration(milliseconds: 300),
      height: height,
      width: width,
      placeholder: (context, url) => Container(
        color: Colors.grey[200],
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
            ),
            const SizedBox(height: 12),
            Text(
              'Chargement...',
              style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
      errorWidget: (context, url, error) => Container(
        color: Colors.grey[100],
        child: GestureDetector(
          onTap: onRetry,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.image_not_supported_outlined,
                size: 48,
                color: Colors.grey[400],
              ),
              const SizedBox(height: 12),
              Text(
                'Impossible de charger',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.blue[100],
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'Réessayer',
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    color: Colors.blue[700],
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Placeholder personnalisé pour le chargement
  static Widget buildLoadingPlaceholder({String? message}) {
    return Container(
      color: Colors.grey[200],
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
          ),
          const SizedBox(height: 12),
          Text(
            message ?? 'Chargement de l\'image...',
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  /// Placeholder personnalisé pour les erreurs
  static Widget buildErrorPlaceholder({
    VoidCallback? onRetry,
    String? message,
  }) {
    return Container(
      color: Colors.grey[100],
      child: GestureDetector(
        onTap: onRetry,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.image_not_supported_outlined,
              size: 48,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 12),
            Text(
              message ?? 'Image non disponible',
              style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }

  /// Valide une URL d'image
  static bool isValidImageUrl(String url) {
    try {
      if (url.isEmpty) return false;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Obtient une URL valide avec fallback
  static String getValidImageUrl(List<String> urls, {String? fallback}) {
    if (urls.isEmpty) {
      return fallback ?? defaultPlaceholder;
    }

    for (String url in urls) {
      if (isValidImageUrl(url)) {
        return url;
      }
    }

    return fallback ?? defaultPlaceholder;
  }

  /// Optimise une URL Unsplash
  static String optimizeUnsplashUrl(String url) {
    if (!url.contains('unsplash.com')) return url;
    // Ajoute des paramètres d'optimisation
    if (url.contains('?')) {
      return '$url&fit=crop&q=80&w=600';
    }
    return '$url?fit=crop&q=80&w=600';
  }

  /// Optimise une URL Pexels
  static String optimizePexelsUrl(String url) {
    if (!url.contains('pexels.com')) return url;
    // Pexels URL est déjà optimisée avec les paramètres
    return url;
  }

  /// Optimise une URL générique
  static String optimizeImageUrl(String url) {
    if (url.contains('unsplash.com')) {
      return optimizeUnsplashUrl(url);
    } else if (url.contains('pexels.com')) {
      return optimizePexelsUrl(url);
    }
    return url;
  }
}
