enum UserRole { tourist, admin }

extension UserRoleExtension on UserRole {
  static UserRole fromString(String role) {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return UserRole.admin;
      default:
        return UserRole.tourist;
    }
  }

  String toShortString() {
    return toString().split('.').last.toUpperCase();
  }
}

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
    final String? name = json['name'];
    final String firstName =
        (json['firstName'] ?? (name?.split(' ').first ?? '')).toString();
    final String lastName =
        (json['lastName'] ??
                (name != null && name.trim().contains(' ')
                    ? name.trim().split(' ').sublist(1).join(' ')
                    : ''))
            .toString();

    final dynamic roleValue = json['role'];
    final UserRole role = roleValue is String
        ? (roleValue.toUpperCase() == 'ADMIN'
              ? UserRole.admin
              : UserRole.tourist)
        : UserRole.values[(roleValue ?? 0) as int];

    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      firstName: firstName,
      lastName: lastName,
      phoneNumber: json['phone'] ?? json['phoneNumber'],
      role: role,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'role': role.toShortString(),
    };
  }
}
