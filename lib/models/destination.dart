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
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      category: json['category'] ?? '',
      rating: (json['rating'] ?? 0.0).toDouble(),
      numberOfReviews: json['numberOfReviews'] ?? 0,
      pricePerPerson: (json['pricePerPerson'] ?? 0.0).toDouble(),
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      mapUrl: json['mapUrl'] ?? '',
      isActive: json['isActive'] ?? true,
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
