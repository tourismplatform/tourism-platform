import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:projet_tourbf/main.dart';

void main() {
  testWidgets('Test role selection navigation', (WidgetTester tester) async {
    FlutterError.onError = (FlutterErrorDetails details) {
      debugPrint('FLUTTER ERROR: ${details.exceptionAsString()}');
      debugPrint(details.stack?.toString());
    };

    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    debugPrint('Tapping tourist button...');
    final touristButton = find.text('Explorer en tant que Touriste');
    expect(touristButton, findsOneWidget);
    
    try {
      await tester.tap(touristButton);
      await tester.pumpAndSettle();
      debugPrint('Successfully entered tourist explorer page');
    } catch (e, stack) {
      debugPrint('EXCEPTION ON TAP TOURIST: $e');
      debugPrint(stack.toString());
    }
  });

  testWidgets('Test admin selection navigation', (WidgetTester tester) async {
    FlutterError.onError = (FlutterErrorDetails details) {
      debugPrint('FLUTTER ERROR: ${details.exceptionAsString()}');
      debugPrint(details.stack?.toString());
    };

    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    debugPrint('Tapping admin button...');
    final adminButton = find.text('Espace Administrateur');
    expect(adminButton, findsOneWidget);
    
    try {
      await tester.tap(adminButton);
      await tester.pumpAndSettle();
      debugPrint('Successfully entered admin page');
    } catch (e, stack) {
      debugPrint('EXCEPTION ON TAP ADMIN: $e');
      debugPrint(stack.toString());
    }
  });
}
