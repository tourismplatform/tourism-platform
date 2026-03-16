enum ReservationStatus { pending, confirmed, cancelled }

extension ReservationStatusExtension on ReservationStatus {
  static ReservationStatus fromString(String status) {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return ReservationStatus.confirmed;
      case 'CANCELLED':
        return ReservationStatus.cancelled;
      default:
        return ReservationStatus.pending;
    }
  }

  String toShortString() {
    return toString().split('.').last.toUpperCase();
  }
}

class Reservation {
  final String id;
  final String userId;
  final String destinationId;
  final String destinationName;
  final DateTime startDate;
  final DateTime endDate;
  final int numberOfPeople;
  final double totalPrice;
  final String? comment;
  final ReservationStatus status;
  final DateTime createdAt;

  Reservation({
    required this.id,
    required this.userId,
    required this.destinationId,
    required this.destinationName,
    required this.startDate,
    required this.endDate,
    required this.numberOfPeople,
    required this.totalPrice,
    this.comment,
    required this.status,
    required this.createdAt,
  });

  int get numberOfDays => endDate.difference(startDate).inDays;

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      destinationId: json['destinationId'] ?? '',
      destinationName: json['destinationName'] ?? '',
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      numberOfPeople: json['numberOfPeople'] ?? 0,
      totalPrice: (json['totalPrice'] ?? 0.0).toDouble(),
      comment: json['comment'],
      status: ReservationStatusExtension.fromString(json['status'] ?? 'PENDING'),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'destinationId': destinationId,
      'destinationName': destinationName,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'numberOfPeople': numberOfPeople,
      'totalPrice': totalPrice,
      'comment': comment,
      'status': status.toShortString(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
