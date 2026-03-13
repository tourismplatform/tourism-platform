enum UserRole { tourist, admin }

class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phoneNumber;
  final UserRole role;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phoneNumber,
    required this.role,
  });

  String get fullName => '$firstName $lastName';

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      phoneNumber: json['phoneNumber'],
      role: UserRole.values[json['role'] ?? 0],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'role': role.index,
    };
  }
}

class Address {
  final String id;
  final String title;
  final String subtitle;
  final String iconStr;
  final String colorStr;

  Address({
    required this.id,
    required this.title,
    required this.subtitle,
    this.iconStr = 'location_on',
    this.colorStr = 'blue',
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      iconStr: json['iconStr'] ?? 'location_on',
      colorStr: json['colorStr'] ?? 'blue',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'iconStr': iconStr,
      'colorStr': colorStr,
    };
  }
}
