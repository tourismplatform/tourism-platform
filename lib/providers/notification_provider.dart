import 'package:flutter/material.dart';

enum NotificationType { reservation, promo, info }

class NotificationModel {
  final String id;
  final String titleKey;
  final String messageKey;
  final DateTime time;
  bool isRead;
  final NotificationType type;

  NotificationModel({
    required this.id,
    required this.titleKey,
    required this.messageKey,
    required this.time,
    this.isRead = false,
    required this.type,
  });
}

class NotificationProvider extends ChangeNotifier {
  final List<NotificationModel> _notifications = [
    NotificationModel(
      id: '1',
      titleKey: 'notif_info_title',
      messageKey: 'notif_info_msg',
      time: DateTime.now().subtract(const Duration(minutes: 5)),
      isRead: false,
      type: NotificationType.info,
    ),
    NotificationModel(
      id: '2',
      titleKey: 'notif_promo_title',
      messageKey: 'notif_promo_msg',
      time: DateTime.now().subtract(const Duration(hours: 2)),
      isRead: false,
      type: NotificationType.promo,
    ),
    NotificationModel(
      id: '3',
      titleKey: 'notif_reservation_title',
      messageKey: 'notif_reservation_msg',
      time: DateTime.now().subtract(const Duration(hours: 24)),
      isRead: true,
      type: NotificationType.reservation,
    ),
  ];

  List<NotificationModel> get notifications => _notifications;

  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  void markAllAsRead() {
    for (final n in _notifications) {
      n.isRead = true;
    }
    notifyListeners();
  }

  void markAsRead(String id) {
    final idx = _notifications.indexWhere((n) => n.id == id);
    if (idx >= 0) {
      _notifications[idx].isRead = true;
      notifyListeners();
    }
  }

  void clearAll() {
    _notifications.clear();
    notifyListeners();
  }

  void addNotification({
    required String titleKey,
    required String messageKey,
    NotificationType type = NotificationType.info,
  }) {
    _notifications.insert(
      0,
      NotificationModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        titleKey: titleKey,
        messageKey: messageKey,
        time: DateTime.now(),
        isRead: false,
        type: type,
      ),
    );
    notifyListeners();
  }

  /// Returns a human-friendly relative time string.
  String relativeTime(DateTime time, String lang) {
    final diff = DateTime.now().difference(time);
    if (lang == 'fr') {
      if (diff.inMinutes < 1) return "À l'instant";
      if (diff.inMinutes < 60) return "Il y a ${diff.inMinutes} min";
      if (diff.inHours < 24) return "Il y a ${diff.inHours}h";
      return "Il y a ${diff.inDays}j";
    } else if (lang == 'en') {
      if (diff.inMinutes < 1) return "Just now";
      if (diff.inMinutes < 60) return "${diff.inMinutes} min ago";
      if (diff.inHours < 24) return "${diff.inHours}h ago";
      return "${diff.inDays}d ago";
    } else if (lang == 'mos') {
      if (diff.inMinutes < 1) return "Masã";
      if (diff.inMinutes < 60) return "Bɩɩ ${diff.inMinutes} min";
      if (diff.inHours < 24) return "Bɩɩ ${diff.inHours}h";
      return "Bɩɩ ${diff.inDays}d";
    } else {
      if (diff.inMinutes < 1) return "Sisan";
      if (diff.inMinutes < 60) return "Sɔn ${diff.inMinutes} min";
      if (diff.inHours < 24) return "Sɔn ${diff.inHours}h";
      return "Sɔn ${diff.inDays}j";
    }
  }
}
