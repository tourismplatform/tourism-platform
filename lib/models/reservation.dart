enum ReservationStatus { pending, confirmed, cancelled, completed }

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

  int get numberOfDays =>
      (endDate.difference(startDate).inDays).abs().clamp(1, 9999);

  factory Reservation.fromJson(Map<String, dynamic> json) {
    final dynamic statusValue = json['status'];
    final ReservationStatus status = statusValue is String
        ? () {
            switch (statusValue.toUpperCase()) {
              case 'CONFIRMED':
                return ReservationStatus.confirmed;
              case 'CANCELLED':
                return ReservationStatus.cancelled;
              case 'COMPLETED':
                return ReservationStatus.completed;
              case 'PENDING':
              default:
                return ReservationStatus.pending;
            }
          }()
        : ReservationStatus.values[(statusValue ?? 0) as int];

    final String destinationName =
        (json['destinationName'] ??
                json['destinations']?['name'] ??
                json['destination']?['name'] ??
                '')
            .toString();

    return Reservation(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? json['userId'] ?? '',
      destinationId: json['destination_id'] ?? json['destinationId'] ?? '',
      destinationName: destinationName,
      startDate: DateTime.parse(
        (json['check_in'] ?? json['startDate']).toString(),
      ),
      endDate: DateTime.parse(
        (json['check_out'] ?? json['endDate']).toString(),
      ),
      numberOfPeople: json['nb_persons'] ?? json['numberOfPeople'] ?? 0,
      totalPrice: (json['total_price'] ?? json['totalPrice'] ?? 0.0).toDouble(),
      comment: json['comment'],
      status: status,
      createdAt: DateTime.parse(
        (json['created_at'] ?? json['createdAt']).toString(),
      ),
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
