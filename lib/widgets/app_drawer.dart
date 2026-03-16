import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../providers/auth_provider.dart';
import '../providers/language_provider.dart';
import '../providers/theme_provider.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Consumer2<AuthProvider, LanguageProvider>(
        builder: (context, authProvider, langProvider, _) {
          final user = authProvider.currentUser;
          final photoPath = authProvider.profilePhotoPath;

          return Column(
            children: [
              // ── Header ──────────────────────────────────────────────
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(24, 64, 24, 24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue[800]!, Colors.blue[600]!],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Tappable avatar
                    GestureDetector(
                      onTap: () => _pickProfilePhoto(context, langProvider, authProvider),
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 36,
                            backgroundColor: Colors.white,
                            backgroundImage: (photoPath != null && photoPath.isNotEmpty)
                                ? FileImage(File(photoPath))
                                : null,
                            child: (photoPath == null || photoPath.isEmpty)
                                ? Text(
                                    user?.firstName.substring(0, 1).toUpperCase() ?? 'U',
                                    style: GoogleFonts.poppins(
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.blue[800],
                                    ),
                                  )
                                : null,
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.blue[700]!, width: 1.5),
                              ),
                              child: Icon(Icons.camera_alt, size: 14, color: Colors.blue[800]),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      user?.fullName ?? 'Utilisateur',
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      user?.email ?? 'email@example.com',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.blue[100],
                      ),
                    ),
                  ],
                ),
              ),

              // ── Menu Items ──────────────────────────────────────────
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  children: [
                    _buildDrawerItem(
                      context,
                      icon: Icons.person_outline,
                      title: langProvider.translate('my_profile'),
                      onTap: () {
                        Navigator.pop(context);
                        _showEditProfileSheet(context, langProvider, authProvider);
                      },
                    ),

                    _buildDrawerItem(
                      context,
                      icon: Icons.location_on_outlined,
                      title: langProvider.translate('my_addresses'),
                      onTap: () {
                        Navigator.pop(context);
                        _showAddressesSheet(context, langProvider);
                      },
                    ),

                    _buildDrawerItem(
                      context,
                      icon: Icons.help_outline,
                      title: langProvider.translate('help_support'),
                      onTap: () {
                        Navigator.pop(context);
                        _showHelpDialog(context, langProvider);
                      },
                    ),

                    // ── Section Sécurité ────────────────────────────
                    const Padding(
                      padding: EdgeInsets.fromLTRB(24, 16, 24, 4),
                      child: Divider(),
                    ),
                    _buildSectionLabel(langProvider.translate('section_security')),
                    _buildDrawerItem(
                      context,
                      icon: Icons.security,
                      title: langProvider.translate('security_app'),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/settings', arguments: 'security');
                      },
                    ),

                    // ── Section Langue ──────────────────────────────
                    const Padding(
                      padding: EdgeInsets.fromLTRB(24, 8, 24, 4),
                      child: Divider(),
                    ),
                    _buildSectionLabel(langProvider.translate('language')),
                    _buildDrawerItem(
                      context,
                      icon: Icons.language,
                      title: langProvider.translate('app_language'),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/settings', arguments: 'language');
                      },
                    ),

                    // ── Section Mode d'affichage ────────────────────
                    const Padding(
                      padding: EdgeInsets.fromLTRB(24, 8, 24, 4),
                      child: Divider(),
                    ),
                    _buildSectionLabel(langProvider.translate('display_mode')),
                    // Toggle nuit/jour inline
                    Consumer<ThemeProvider>(
                      builder: (context, themeProvider, _) => Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                        child: ListTile(
                          leading: Icon(
                            themeProvider.isDarkMode
                                ? Icons.nightlight_round
                                : Icons.wb_sunny_rounded,
                            color: themeProvider.isDarkMode
                                ? Colors.indigo[300]
                                : Colors.orange[700],
                            size: 26,
                          ),
                          title: Text(
                            themeProvider.isDarkMode
                                ? '🌙  ${langProvider.translate("theme_dark")}'
                                : '☀️  ${langProvider.translate("section_display")}',
                            style: GoogleFonts.poppins(
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey[800],
                            ),
                          ),
                          trailing: Switch(
                            value: themeProvider.isDarkMode,
                            onChanged: (_) => themeProvider.toggleTheme(),
                            thumbColor: WidgetStateProperty.resolveWith(
                              (states) => states.contains(WidgetState.selected)
                                  ? Colors.indigo[400]
                                  : Colors.white,
                            ),
                          ),
                          onTap: () => themeProvider.toggleTheme(),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // ── Footer ─────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.all(24),
                child: _buildDrawerItem(
                  context,
                  icon: Icons.logout,
                  title: langProvider.translate('logout'),
                  isDestructive: true,
                  onTap: () {
                    authProvider.logout();
                    Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 4, 24, 2),
      child: Text(
        label.toUpperCase(),
        style: GoogleFonts.poppins(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: Colors.blue[700],
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildDrawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    final color = isDestructive ? Colors.red : Colors.grey[800];

    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: color,
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 24),
      onTap: onTap,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      hoverColor: Colors.blue.withValues(alpha: 0.05),
    );
  }

  // ── Pick profile photo ─────────────────────────────────────────────────
  Future<void> _pickProfilePhoto(
    BuildContext context,
    LanguageProvider langProvider,
    AuthProvider authProvider,
  ) async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 85,
    );
    if (picked != null) {
      authProvider.updateProfilePhoto(picked.path);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              langProvider.translate('photo_updated'),
              style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
            ),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            backgroundColor: Colors.green[700],
          ),
        );
      }
    }
  }

  void _showEditProfileSheet(
    BuildContext context,
    LanguageProvider langProvider,
    AuthProvider authProvider,
  ) {
    final user = authProvider.currentUser;
    final nameController = TextEditingController(text: user?.fullName ?? '');
    final emailController = TextEditingController(text: user?.email ?? '');
    final photoPath = authProvider.profilePhotoPath;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
            left: 24,
            right: 24,
            top: 32,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar cliquable dans le sheet
              Center(
                child: GestureDetector(
                  onTap: () async {
                    final picker = ImagePicker();
                    final picked = await picker.pickImage(
                      source: ImageSource.gallery,
                      maxWidth: 512,
                      maxHeight: 512,
                      imageQuality: 85,
                    );
                    if (picked != null) {
                      authProvider.updateProfilePhoto(picked.path);
                      setSheetState(() {});
                    }
                  },
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 48,
                        backgroundColor: Colors.blue[100],
                        backgroundImage:
                            (authProvider.profilePhotoPath != null && authProvider.profilePhotoPath!.isNotEmpty)
                                ? FileImage(File(authProvider.profilePhotoPath!))
                                : null,
                        child: (authProvider.profilePhotoPath == null || authProvider.profilePhotoPath!.isEmpty)
                            ? Icon(Icons.person, size: 48, color: Colors.blue[800])
                            : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.blue[800],
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          child: const Icon(Icons.edit, size: 14, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: TextButton.icon(
                  onPressed: () async {
                    final picker = ImagePicker();
                    final picked = await picker.pickImage(
                      source: ImageSource.gallery,
                      maxWidth: 512,
                      maxHeight: 512,
                      imageQuality: 85,
                    );
                    if (picked != null) {
                      authProvider.updateProfilePhoto(picked.path);
                      setSheetState(() {});
                    }
                  },
                  icon: const Icon(Icons.camera_alt_outlined, size: 16),
                  label: Text(
                    (photoPath != null && photoPath.isNotEmpty)
                        ? langProvider.translate('change_photo')
                        : langProvider.translate('upload_photo'),
                    style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person, color: Colors.blue),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    langProvider.translate('edit_profile'),
                    style: GoogleFonts.poppins(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: langProvider.translate('full_name'),
                  labelStyle: GoogleFonts.poppins(),
                  prefixIcon: const Icon(Icons.badge_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[300]!),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[300]!),
                  ),
                  filled: true,
                  fillColor: Colors.grey[50],
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: langProvider.translate('email'),
                  labelStyle: GoogleFonts.poppins(),
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[300]!),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[300]!),
                  ),
                  filled: true,
                  fillColor: Colors.grey[50],
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[800],
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  onPressed: () {
                    Provider.of<AuthProvider>(ctx, listen: false).updateUser(
                      firstName: nameController.text.split(' ').first,
                      lastName: nameController.text.split(' ').length > 1
                          ? nameController.text.split(' ').sublist(1).join(' ')
                          : '',
                      email: emailController.text,
                    );
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          langProvider.translate('profile_updated'),
                          style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
                        ),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        backgroundColor: Colors.green[700],
                      ),
                    );
                  },
                  child: Text(
                    langProvider.translate('save_changes'),
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAddressesSheet(BuildContext context, LanguageProvider langProvider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            padding: const EdgeInsets.fromLTRB(24, 32, 24, 32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.orange.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.location_on, color: Colors.orange),
                    ),
                    const SizedBox(width: 16),
                    Text(
                      langProvider.translate('my_addresses'),
                      style: GoogleFonts.poppins(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                ...authProvider.addresses.map((address) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _buildAddressCard(
                      context,
                      id: address.id,
                      title: address.title,
                      subtitle: address.subtitle,
                      icon: _getIconFromString(address.iconStr),
                      color: _getColorFromString(address.colorStr),
                      langProvider: langProvider,
                    ),
                  );
                }),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.blue[800]!, width: 1.5),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      _showEditAddressDialog(context, '', '', null, langProvider);
                    },
                    icon: Icon(Icons.add_location_alt_outlined, color: Colors.blue[800]),
                    label: Text(
                      langProvider.translate('add_new_address'),
                      style: GoogleFonts.poppins(
                        color: Colors.blue[800],
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  IconData _getIconFromString(String iconStr) {
    switch (iconStr) {
      case 'home_rounded':
        return Icons.home_rounded;
      case 'work_rounded':
        return Icons.work_rounded;
      default:
        return Icons.location_on;
    }
  }

  Color _getColorFromString(String colorStr) {
    switch (colorStr) {
      case 'blue':
        return Colors.blue;
      case 'green':
        return Colors.green;
      default:
        return Colors.orange;
    }
  }

  Widget _buildAddressCard(
    BuildContext context, {
    required String id,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required LanguageProvider langProvider,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        border: Border.all(color: Colors.grey[200]!),
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(
          title,
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.poppins(
            color: Colors.grey[600],
            fontSize: 13,
          ),
        ),
        trailing: IconButton(
          icon: const Icon(Icons.edit_outlined, color: Colors.grey),
          onPressed: () {
            Navigator.pop(context);
            _showEditAddressDialog(context, title, subtitle, id, langProvider);
          },
        ),
      ),
    );
  }

  void _showEditAddressDialog(
    BuildContext context,
    String currentTitle,
    String currentSubtitle,
    String? id,
    LanguageProvider langProvider,
  ) {
    final titleController = TextEditingController(text: currentTitle);
    final subtitleController = TextEditingController(text: currentSubtitle);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          id == null
              ? langProvider.translate('add_address')
              : langProvider.translate('edit_address'),
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleController,
              decoration: InputDecoration(
                labelText: langProvider.translate('address_name_hint'),
                labelStyle: GoogleFonts.poppins(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: subtitleController,
              decoration: InputDecoration(
                labelText: langProvider.translate('full_address'),
                labelStyle: GoogleFonts.poppins(),
              ),
            ),
          ],
        ),
        actions: [
          if (id != null)
            TextButton(
              onPressed: () {
                Provider.of<AuthProvider>(context, listen: false).deleteAddress(id);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(langProvider.translate('address_deleted'),
                        style: GoogleFonts.poppins()),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              child: Text(langProvider.translate('delete'),
                  style: const TextStyle(color: Colors.red)),
            ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(langProvider.translate('cancel')),
          ),
          ElevatedButton(
            onPressed: () {
              final authProvider =
                  Provider.of<AuthProvider>(context, listen: false);
              if (id == null) {
                authProvider.addAddress(
                    titleController.text, subtitleController.text);
              } else {
                authProvider.updateAddress(
                    id, titleController.text, subtitleController.text);
              }
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(langProvider.translate('address_saved_success'),
                      style: GoogleFonts.poppins()),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: Text(langProvider.translate('save')),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog(BuildContext context, LanguageProvider langProvider) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.support_agent,
                    size: 48, color: Colors.blue),
              ),
              const SizedBox(height: 24),
              Text(
                langProvider.translate('need_help'),
                style: GoogleFonts.poppins(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                langProvider.translate('support_message'),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  color: Colors.grey[600],
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[800],
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(langProvider.translate('opening_messaging'))),
                    );
                  },
                  icon: const Icon(Icons.chat_bubble_outline),
                  label: Text(langProvider.translate('write_to_us'),
                      style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text(
                  langProvider.translate('close'),
                  style: GoogleFonts.poppins(
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
