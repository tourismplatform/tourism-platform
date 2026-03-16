import 'package:flutter/foundation.dart';

class Destination {
  final String id;
  final String name;
  final String description;
  final String location;
  final String category;
  final double rating;
  final int numberOfReviews;
  final double pricePerPerson;
  final List<String> imageUrls;
  final String mapUrl;
  final bool isActive;

  Destination({
    required this.id,
    required this.name,
    required this.description,
    required this.location,
    required this.category,
    required this.rating,
    required this.numberOfReviews,
    required this.pricePerPerson,
    required this.imageUrls,
    required this.mapUrl,
    required this.isActive,
  });

  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? json['nom'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? json['adresse'] ?? '',
      category: json['category'] ?? json['categorie'] ?? '',
      rating: (json['avg_rating'] ?? json['rating'] ?? json['note'] ?? 0.0).toDouble(),
      numberOfReviews: json['numberOfReviews'] ?? json['number_of_reviews'] ?? json['nb_avis'] ?? 0,
      pricePerPerson: (json['price_per_person'] ?? json['pricePerPerson'] ?? json['price_per_person'] ?? json['prix_par_personne'] ?? 0.0).toDouble(),
      imageUrls: json['images'] != null 
          ? List<String>.from(json['images']) 
          : (json['imageUrls'] != null 
              ? List<String>.from(json['imageUrls']) 
              : (json['image_urls'] != null ? List<String>.from(json['image_urls']) : [])),
      mapUrl: json['mapUrl'] ?? json['map_url'] ?? '',
      isActive: json['isActive'] ?? json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'location': location,
      'category': category,
      'rating': rating,
      'numberOfReviews': numberOfReviews,
      'pricePerPerson': pricePerPerson,
      'imageUrls': imageUrls,
      'mapUrl': mapUrl,
      'isActive': isActive,
    };
  }
}
