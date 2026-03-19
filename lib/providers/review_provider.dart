import 'package:flutter/material.dart';
import '../models/index.dart';
import '../constants/constants.dart';
import '../services/api_service.dart';

class ReviewProvider extends ChangeNotifier {
  final List<Review> _reviews = [];
  bool _isLoading = false;
  String? _error;

  List<Review> get reviews => _reviews;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadReviews(String destinationId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final json = await ApiService.get('$reviewsEndpoint/$destinationId');
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      _reviews
        ..clear()
        ..addAll(
          data is List
              ? data.whereType<Map<String, dynamic>>().map(
                  (e) => Review.fromJson(e),
                )
              : const Iterable<Review>.empty(),
        );
      _error = null;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addReview(Review review) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final token = await ApiService.getToken();
      if (token == null || token.isEmpty) {
        throw Exception('Veuillez vous connecter');
      }

      final json = await ApiService.post(
        reviewsEndpoint,
        token: token,
        body: {
          'destination_id': review.destinationId,
          'rating': review.rating,
          'comment': review.comment,
        },
      );
      final data = (json is Map<String, dynamic>) ? json['data'] : null;
      if (data is Map<String, dynamic>) {
        _reviews.insert(0, Review.fromJson(data));
      } else {
        _reviews.insert(0, review);
      }
      _error = null;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  List<Review> getReviewsByDestination(String destinationId) {
    return _reviews.where((r) => r.destinationId == destinationId).toList();
  }

  double getAverageRating(String destinationId) {
    final destinationReviews = getReviewsByDestination(destinationId);
    if (destinationReviews.isEmpty) return 0;
    final sum = destinationReviews.fold<double>(
      0,
      (previous, review) => previous + review.rating,
    );
    return sum / destinationReviews.length;
  }
}
