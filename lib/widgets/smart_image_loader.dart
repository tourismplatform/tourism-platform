import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class SmartImageLoader extends StatelessWidget {
  final String imageUrl;
  final String? fallbackUrl;
  final BoxFit fit;
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const SmartImageLoader({
    super.key,
    required this.imageUrl,
    this.fallbackUrl,
    this.fit = BoxFit.cover,
    this.width = double.infinity,
    this.height = 200,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    // Si l'image est un asset local
    if (imageUrl.startsWith('assets/')) {
      return ClipRRect(
        borderRadius: borderRadius ?? BorderRadius.zero,
        child: Image.asset(
          imageUrl,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (context, error, stackTrace) {
            // Fallback vers l'URL distante si disponible
            if (fallbackUrl != null && !fallbackUrl!.startsWith('assets/')) {
              return SmartImageLoader(
                imageUrl: fallbackUrl!,
                fit: fit,
                width: width,
                height: height,
                borderRadius: borderRadius,
              );
            }
            return Container(
              width: width,
              height: height,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: borderRadius,
              ),
              child: const Center(
                child: Icon(Icons.image_not_supported, color: Colors.grey),
              ),
            );
          },
        ),
      );
    }

    // Si c'est une URL distante
    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.zero,
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        width: width,
        height: height,
        fit: fit,
        placeholder: (context, url) => Container(
          width: width,
          height: height,
          color: Colors.grey[300],
          child: const Center(
            child: CircularProgressIndicator(),
          ),
        ),
        errorWidget: (context, url, error) {
          // Utiliser le fallback si disponible
          if (fallbackUrl != null) {
            return SmartImageLoader(
              imageUrl: fallbackUrl!,
              fit: fit,
              width: width,
              height: height,
              borderRadius: borderRadius,
            );
          }
          return Container(
            width: width,
            height: height,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: borderRadius,
            ),
            child: const Center(
              child: Icon(Icons.image_not_supported, color: Colors.grey),
            ),
          );
        },
      ),
    );
  }
}
