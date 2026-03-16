import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RatingStars extends StatelessWidget {
  final double rating;
  final int? numberOfReviews;
  final Function(int)? onRatingChanged;
  final bool isInteractive;
  final double size;

  const RatingStars({
    super.key,
    required this.rating,
    this.numberOfReviews,
    this.onRatingChanged,
    this.isInteractive = false,
    this.size = 20,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Row(
          children: List.generate(5, (index) {
            return GestureDetector(
              onTap: isInteractive
                  ? () => onRatingChanged?.call(index + 1)
                  : null,
              child: Icon(
                index < rating ? Icons.star : Icons.star_border,
                color: Colors.amber,
                size: size,
              ),
            );
          }),
        ),
        if (numberOfReviews != null) ...[
          const SizedBox(width: 8),
          Text(
            '($numberOfReviews)',
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
          ),
        ],
      ],
    );
  }
}
