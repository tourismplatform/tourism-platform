import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RatingStars extends StatelessWidget {
  final double rating;
  final int? numberOfReviews;
  final Function(int)? onRatingChanged;
  final bool isInteractive;
  final double size;
  final Color color; // Added this line for the new 'color' property

  const RatingStars({
    super.key, // Changed from Key? key,
    required this.rating,
    this.numberOfReviews,
    this.onRatingChanged, // Kept this parameter as it's a class member
    this.isInteractive = false, // Kept this parameter as it's a class member
    this.size = 16, // Changed default value from 20 to 16
    this.color = Colors.amber, // Added this new parameter
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
