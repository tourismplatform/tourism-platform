class Review {
  final String id;
  final String destinationId;
  final String userId;
  final String userName;
  final int rating;
  final String comment;
  final DateTime createdAt;

  Review({
    required this.id,
    required this.destinationId,
    required this.userId,
    required this.userName,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? '',
      destinationId: json['destination_id'] ?? json['destinationId'] ?? '',
      userId: json['user_id'] ?? json['userId'] ?? '',
      userName: json['users']?['name'] ?? json['userName'] ?? 'Anonyme',
      rating: json['rating'] ?? 0,
      comment: json['comment'] ?? '',
      createdAt: DateTime.parse((json['created_at'] ?? json['createdAt']).toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'destinationId': destinationId,
      'userId': userId,
      'userName': userName,
      'rating': rating,
      'comment': comment,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
