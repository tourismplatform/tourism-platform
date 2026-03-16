import 'package:flutter/material.dart';
import '../models/index.dart';
import '../services/review_service.dart';
import '../services/api_service.dart';
import '../constants/api_constants.dart';


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
      final List<dynamic> data = await ApiService.get('${ApiConstants.reviews}?destinationId=$destinationId');
      _reviews.clear();
      _reviews.addAll(data.map((json) => Review.fromJson(json)).toList());
      _error = null;
    } catch (e) {
      _error = 'Erreur lors du chargement des avis : $e';
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
      await ReviewService.addReview(review.toJson());
      _reviews.add(review);
      _error = null;
    } catch (e) {
      _error = 'Erreur lors de l\'ajout de l\'avis : $e';
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
