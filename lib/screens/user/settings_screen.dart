import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/theme_provider.dart';
import '../../providers/language_provider.dart';

class SettingsScreen extends StatefulWidget {
  final String? initialTab;
  const SettingsScreen({super.key, this.initialTab});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _biometricEnabled = false;
  bool _notificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, langProvider, _) {
        final tab = widget.initialTab;

        return Scaffold(
          appBar: AppBar(
            title: Text(
              _appBarTitle(tab, langProvider),
              style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            elevation: 0,
          ),
          body: ListView(
            padding: const EdgeInsets.symmetric(vertical: 16),
            children: [
              // ── Afficher uniquement la section pertinente ──────────────
              if (tab == null || tab == 'language') ...[
                _buildSectionHeader(langProvider.translate('language')),
                _buildLanguageSelector(langProvider),
              ],
              if (tab == null) const SizedBox(height: 24),

              if (tab == null || tab == 'theme') ...[
                _buildSectionHeader(langProvider.translate('display_mode')),
                _buildThemeSelector(langProvider),
              ],
              if (tab == null) const SizedBox(height: 24),

              if (tab == null || tab == 'security') ...[
                _buildSectionHeader(langProvider.translate('security_privacy')),
                _buildSwitchTile(
                  title: langProvider.translate('auth_biometric'),
                  subtitle: langProvider.translate('auth_biometric_sub'),
                  icon: Icons.fingerprint,
                  value: _biometricEnabled,
                  onChanged: (val) => setState(() => _biometricEnabled = val),
                ),
                const Divider(),
                _buildListTile(
                  title: langProvider.translate('change_password'),
                  icon: Icons.lock_outline,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(langProvider.translate('feature_coming_soon'))),
                    );
                  },
                ),
                const Divider(),
                _buildListTile(
                  title: langProvider.translate('app_security_admin'),
                  icon: Icons.admin_panel_settings_outlined,
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text(langProvider.translate('security_app'),
                            style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
                        content: Text(
                          langProvider.translate('section_security'),
                          style: GoogleFonts.poppins(),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text(langProvider.translate('close')),
                          )
                        ],
                      ),
                    );
                  },
                ),
              ],
              if (tab == null) const SizedBox(height: 24),

              // Notifications uniquement en mode "tout afficher"
              if (tab == null) ...[
                _buildSectionHeader(langProvider.translate('notifications_title')),
                _buildSwitchTile(
                  title: langProvider.translate('push_notifications'),
                  subtitle: langProvider.translate('push_notifications_sub'),
                  icon: Icons.notifications_active_outlined,
                  value: _notificationsEnabled,
                  onChanged: (val) => setState(() => _notificationsEnabled = val),
                ),
                const SizedBox(height: 24),
                _buildSectionHeader(langProvider.translate('about')),
                _buildListTile(
                  title: langProvider.translate('terms_of_use'),
                  icon: Icons.description_outlined,
                  onTap: () {},
                ),
                const Divider(),
                _buildListTile(
                  title: langProvider.translate('privacy_policy'),
                  icon: Icons.privacy_tip_outlined,
                  onTap: () {},
                ),
              ],

              const SizedBox(height: 48),
              Center(
                child: Text(
                  'EXPLORERBF v1.0.0',
                  style: GoogleFonts.poppins(color: Colors.grey, fontSize: 12),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  String _appBarTitle(String? tab, LanguageProvider lp) {
    switch (tab) {
      case 'security':
        return lp.translate('section_security');
      case 'language':
        return lp.translate('language');
      case 'theme':
        return lp.translate('display_mode');
      default:
        return lp.translate('settings');
    }
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      child: Text(
        title.toUpperCase(),
        style: GoogleFonts.poppins(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.blue[800],
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildListTile({
    required String title,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: Colors.grey[800]),
      ),
      title: Text(
        title,
        style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w500),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
      onTap: onTap,
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SwitchListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
      secondary: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: Colors.grey[800]),
      ),
      title: Text(title,
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w500)),
      subtitle: Text(subtitle,
          style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
      value: value,
      onChanged: onChanged,
    );
  }

  Widget _buildLanguageSelector(LanguageProvider langProvider) {
    final Map<String, String> langNames = {
      'fr': 'Français',
      'en': 'English',
      'mos': 'Mooré',
      'diu': 'Dioula',
    };
    final langName = langNames[langProvider.currentLanguageCode] ?? 'Français';

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(Icons.language, color: Colors.grey[800]),
      ),
      title: Text(langProvider.translate('app_language'),
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w500)),
      subtitle: Text(langName,
          style: GoogleFonts.poppins(fontSize: 14, color: Colors.blue[700])),
      trailing: const Icon(Icons.arrow_drop_down, color: Colors.grey),
      onTap: () => _showLanguageDialog(langProvider),
    );
  }

  Widget _buildThemeSelector(LanguageProvider langProvider) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, _) {
        return SwitchListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
          secondary: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: themeProvider.isDarkMode ? Colors.grey[800] : Colors.grey[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              themeProvider.isDarkMode ? Icons.dark_mode : Icons.light_mode,
              color: themeProvider.isDarkMode ? Colors.yellow[700] : Colors.grey[800],
            ),
          ),
          title: Text(langProvider.translate('theme_dark'),
              style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w500)),
          value: themeProvider.isDarkMode,
          onChanged: (val) => themeProvider.toggleTheme(),
        );
      },
    );
  }

  void _showLanguageDialog(LanguageProvider langProvider) {
    final Map<String, String> languages = {
      'Français': 'fr',
      'English': 'en',
      'Mooré': 'mos',
      'Dioula': 'diu',
    };

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            langProvider.translate('app_language'),
            style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: languages.keys.map((langName) {
              final code = languages[langName]!;
              return ListTile(
                title: Text(langName, style: GoogleFonts.poppins()),
                trailing: langProvider.currentLanguageCode == code
                    ? const Icon(Icons.check, color: Colors.blue)
                    : null,
                onTap: () {
                  langProvider.setLanguage(code);
                  Navigator.pop(context);
                },
              );
            }).toList(),
          ),
        );
      },
    );
  }
}
