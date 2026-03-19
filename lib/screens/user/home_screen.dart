import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/index.dart';
import '../../widgets/index.dart';
import '../../constants/constants.dart';
import '../../models/index.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  String? _selectedCategory;
  final ScrollController _scrollController = ScrollController();
  late AnimationController _animController;
  late Animation<double> _fadeIn;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _fadeIn = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);
    final size = MediaQuery.of(context).size;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F6FA),
        drawer: const AppDrawer(),
        body: Consumer<DestinationProvider>(
          builder: (context, destinationProvider, _) {
            return FadeTransition(
              opacity: _fadeIn,
              child: CustomScrollView(
                controller: _scrollController,
                physics: const BouncingScrollPhysics(),
                slivers: [
                  // ─── Hero Header ──────────────────────────────
                  _buildHeroHeader(context, langProvider, size),

                  // ─── Search bar ────────────────────────────────
                  SliverToBoxAdapter(
                    child: _buildSearchBar(langProvider),
                  ),

                  // ─── Popular destinations carousel ────────────
                  SliverToBoxAdapter(
                    child: _buildSectionHeader(
                      langProvider.translate('popular'),
                      icon: Icons.local_fire_department,
                      iconColor: const Color(0xFFFF6B35),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: SizedBox(
                      height: 300,
                      child: destinationProvider.isLoading
                          ? _buildLoadingShimmer()
                          : _buildPopularCarousel(
                              destinationProvider.destinations,
                              context,
                            ),
                    ),
                  ),

                  // ─── Categories ───────────────────────────────
                  SliverToBoxAdapter(
                    child: _buildSectionHeader(
                      langProvider.translate('categories'),
                      icon: Icons.explore,
                      iconColor: const Color(0xFF4B7BE5),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: _buildModernCategories(
                        langProvider, destinationProvider),
                  ),

                  // ─── All destinations / Filtered ──────────────
                  SliverToBoxAdapter(
                    child: _buildSectionHeader(
                      _selectedCategory != null
                          ? '${langProvider.translate('explore')} ${langProvider.translate(_selectedCategory!.toLowerCase())}'
                          : langProvider.translate('all_destinations'),
                      icon: Icons.map_outlined,
                      iconColor: const Color(0xFF17C37B),
                    ),
                  ),
                  SliverPadding(
                    padding:
                        const EdgeInsets.fromLTRB(16, 0, 16, 32),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final destination =
                              destinationProvider.destinations[index];
                          return _buildModernListCard(destination, context);
                        },
                        childCount: destinationProvider.destinations.length,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeroHeader(
      BuildContext context, LanguageProvider langProvider, Size size) {
    return SliverToBoxAdapter(
      child: Container(
        height: 210,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1A237E), Color(0xFF283593), Color(0xFF3949AB)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(36)),
        ),
        child: Stack(
          children: [
            // Decorative circles
            Positioned(
              top: -40,
              right: -30,
              child: Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.06),
                ),
              ),
            ),
            Positioned(
              bottom: -60,
              left: -20,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              ),
            ),

            // Content
            SafeArea(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Menu icon with glass effect
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Row(
                            children: [
                              Builder(
                                builder: (ctx) => GestureDetector(
                                  onTap: () => Scaffold.of(ctx).openDrawer(),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: BackdropFilter(
                                      filter: ImageFilter.blur(
                                          sigmaX: 6, sigmaY: 6),
                                      child: Container(
                                        width: 44,
                                        height: 44,
                                        decoration: BoxDecoration(
                                          color: Colors.white
                                              .withValues(alpha: 0.15),
                                          borderRadius:
                                              BorderRadius.circular(12),
                                          border: Border.all(
                                            color: Colors.white
                                                .withValues(alpha: 0.3),
                                          ),
                                        ),
                                        child: const Icon(Icons.menu,
                                            color: Colors.white, size: 22),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    appName,
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  Text(
                                    appSubtitle,
                                    style: GoogleFonts.poppins(
                                      color: Colors.white
                                          .withValues(alpha: 0.8),
                                      fontSize: 11,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 22),
                          Text(
                            langProvider.translate('explore_burkina'),
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            langProvider.translate('explore_subtitle'),
                            style: GoogleFonts.poppins(
                              color: Colors.white.withValues(alpha: 0.75),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Notification bell with badge
                    Consumer<NotificationProvider>(
                      builder: (context, notifProvider, _) {
                        final count = notifProvider.unreadCount;
                        return GestureDetector(
                          onTap: () => _showNotificationsPanel(
                              context, notifProvider, langProvider),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: BackdropFilter(
                              filter: ImageFilter.blur(sigmaX: 6, sigmaY: 6),
                              child: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.3),
                                  ),
                                ),
                                child: Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    const Icon(Icons.notifications_outlined,
                                        color: Colors.white, size: 22),
                                    if (count > 0)
                                      Positioned(
                                        top: 6,
                                        right: 6,
                                        child: Container(
                                          width: 16,
                                          height: 16,
                                          decoration: const BoxDecoration(
                                            color: Colors.red,
                                            shape: BoxShape.circle,
                                          ),
                                          child: Center(
                                            child: Text(
                                              count > 9 ? '9+' : '$count',
                                              style: GoogleFonts.poppins(
                                                color: Colors.white,
                                                fontSize: 9,
                                                fontWeight: FontWeight.w800,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Floating Search Bar
  // ─────────────────────────────────────────────────────────────────────
  Widget _buildSearchBar(LanguageProvider langProvider) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 4),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF3949AB).withValues(alpha: 0.12),
              blurRadius: 24,
              spreadRadius: 0,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: TextField(
          readOnly: true,
          onTap: () {},
          decoration: InputDecoration(
            hintText: langProvider.translate('search_destination'),
            hintStyle: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey[400],
            ),
            prefixIcon: const Icon(Icons.search,
                color: Color(0xFF3949AB), size: 22),
            suffixIcon: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF3949AB), Color(0xFF1565C0)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.tune, color: Colors.white, size: 18),
            ),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 4,
              vertical: 16,
            ),
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Section Header with icon
  // ─────────────────────────────────────────────────────────────────────
  Widget _buildSectionHeader(String title,
      {required IconData icon, required Color iconColor}) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 10),
          Text(
            title,
            style: GoogleFonts.poppins(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A237E),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Horizontal Popular Carousel with Glassmorphism
  // ─────────────────────────────────────────────────────────────────────
  Widget _buildPopularCarousel(
      List<Destination> destinations, BuildContext context) {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: destinations.length,
      itemBuilder: (context, index) {
        final dest = destinations[index];
        return GestureDetector(
          onTap: () => Navigator.of(context)
              .pushNamed('/destination-detail', arguments: {
                'id': dest.id,
                'showReservation': true,
              }),
          child: Container(
            width: 230,
            margin: const EdgeInsets.only(right: 16, bottom: 4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF1A237E).withValues(alpha: 0.18),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Image
                  if (dest.imageUrls.isNotEmpty)
                    SmartImageLoader(
                      imageUrl: dest.imageUrls[0],
                      width: double.infinity,
                      height: double.infinity,
                      fit: BoxFit.cover,
                    )
                  else
                    Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF1A237E), Color(0xFF283593)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                    ),

                  // Bottom glassmorphism overlay
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: ClipRect(
                      child: BackdropFilter(
                        filter:
                            ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.3),
                            border: Border(
                              top: BorderSide(
                                color: Colors.white
                                    .withValues(alpha: 0.15),
                              ),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding:
                                        const EdgeInsets.symmetric(
                                            horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: Colors.white
                                          .withValues(alpha: 0.2),
                                      borderRadius:
                                          BorderRadius.circular(20),
                                      border: Border.all(
                                          color: Colors.white
                                              .withValues(alpha: 0.3)),
                                    ),
                                    child: Text(
                                      dest.category.toUpperCase(),
                                      style: GoogleFonts.poppins(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.white,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                  ),
                                  const Spacer(),
                                  const Icon(Icons.star,
                                      color: Colors.amber, size: 13),
                                  const SizedBox(width: 3),
                                  Text(
                                    '${dest.rating}',
                                    style: GoogleFonts.poppins(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                dest.name,
                                style: GoogleFonts.poppins(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  const Icon(Icons.location_on,
                                      color: Colors.white70, size: 11),
                                  const SizedBox(width: 3),
                                  Expanded(
                                    child: Text(
                                      dest.location,
                                      style: GoogleFonts.poppins(
                                        fontSize: 10,
                                        color: Colors.white70,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Favorite button
                  Positioned(
                    top: 12,
                    right: 12,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color:
                                Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.favorite_outline,
                              color: Colors.white, size: 18),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Modern Category Chips with Icons
  // ─────────────────────────────────────────────────────────────────────
  Widget _buildModernCategories(
      LanguageProvider langProvider, DestinationProvider destinationProvider) {
    final List<Map<String, dynamic>> categoryData = [
      {'key': 'Culture', 'icon': Icons.account_balance, 'color': const Color(0xFF6B4423)},
      {'key': 'Aventure', 'icon': Icons.terrain, 'color': const Color(0xFF2D6A3E)},
      {'key': 'Nature', 'icon': Icons.eco, 'color': const Color(0xFF17C37B)},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: categoryData.map((cat) {
          final isSelected = _selectedCategory == cat['key'];
          final color = cat['color'] as Color;
          return Expanded(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedCategory = isSelected ? null : cat['key'] as String;
                });
                if (!isSelected) {
                  destinationProvider
                      .filterByCategory(cat['key'] as String);
                } else {
                  destinationProvider.resetFilter();
                }
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.symmetric(
                    vertical: 14, horizontal: 8),
                decoration: BoxDecoration(
                  color: isSelected ? color : Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isSelected
                        ? color
                        : Colors.grey.withValues(alpha: 0.2),
                    width: isSelected ? 0 : 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: isSelected
                          ? color.withValues(alpha: 0.35)
                          : Colors.black.withValues(alpha: 0.05),
                      blurRadius: isSelected ? 16 : 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Icon(
                      cat['icon'] as IconData,
                      color: isSelected ? Colors.white : color,
                      size: 24,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      langProvider.translate(
                          (cat['key'] as String).toLowerCase()),
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isSelected ? Colors.white : color,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Modern Vertical List Card for the "Explore" section
  // ─────────────────────────────────────────────────────────────────────
  Widget _buildModernListCard(Destination dest, BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context)
          .pushNamed('/destination-detail', arguments: {
            'id': dest.id,
            'showReservation': true,
          }),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 18,
              spreadRadius: 0,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(
                  left: Radius.circular(20)),
              child: SizedBox(
                width: 110,
                height: 110,
                child: dest.imageUrls.isNotEmpty
                    ? SmartImageLoader(
                        imageUrl: dest.imageUrls[0],
                        width: 110,
                        height: 110,
                        fit: BoxFit.cover,
                      )
                    : Container(color: const Color(0xFF3949AB)),
              ),
            ),

            // Details
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3949AB)
                            .withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        dest.category,
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF3949AB),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      dest.name,
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF1A237E),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.location_on,
                            size: 11, color: Colors.grey),
                        const SizedBox(width: 2),
                        Expanded(
                          child: Text(
                            dest.location,
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: Colors.grey[500],
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.star,
                                color: Colors.amber, size: 13),
                            const SizedBox(width: 3),
                            Text(
                              '${dest.rating}',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF1A237E),
                              ),
                            ),
                            Text(
                              '  (${dest.numberOfReviews})',
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                color: Colors.grey[400],
                              ),
                            ),
                          ],
                        ),
                        Text(
                          '${dest.pricePerPerson.toStringAsFixed(0)} CFA',
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF17C37B),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Arrow
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF3949AB).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.arrow_forward_ios,
                    size: 14, color: Color(0xFF3949AB)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Notification Panel
  // ─────────────────────────────────────────────────────────────────────
  void _showNotificationsPanel(
    BuildContext context,
    NotificationProvider notifProvider,
    LanguageProvider langProvider,
  ) {
    // Mark all as read when opening
    notifProvider.markAllAsRead();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.65,
        minChildSize: 0.4,
        maxChildSize: 0.92,
        expand: false,
        builder: (ctx, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 20, 16, 0),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A237E).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.notifications_active,
                          color: Color(0xFF1A237E), size: 20),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      langProvider.translate('notifications'),
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF1A237E),
                      ),
                    ),
                    const Spacer(),
                    // Clear all button
                    Consumer<NotificationProvider>(
                      builder: (context, np, _) => np.notifications.isNotEmpty
                          ? TextButton(
                              onPressed: () {
                                np.clearAll();
                              },
                              child: Text(
                                langProvider.translate('clear_all'),
                                style: GoogleFonts.poppins(
                                  color: Colors.red,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13,
                                ),
                              ),
                            )
                          : const SizedBox.shrink(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              const Divider(height: 1),
              // Notifications list
              Expanded(
                child: Consumer<NotificationProvider>(
                  builder: (context, np, _) {
                    if (np.notifications.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.notifications_off_outlined,
                                size: 64, color: Colors.grey[300]),
                            const SizedBox(height: 16),
                            Text(
                              langProvider.translate('no_notifications'),
                              style: GoogleFonts.poppins(
                                color: Colors.grey[400],
                                fontSize: 15,
                              ),
                            ),
                          ],
                        ),
                      );
                    }
                    return ListView.separated(
                      controller: scrollController,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      itemCount: np.notifications.length,
                      separatorBuilder: (context, _) =>
                          const Divider(height: 1, indent: 72),
                      itemBuilder: (context, index) {
                        final notif = np.notifications[index];
                        final iconData = _notifIcon(notif.type);
                        final iconColor = _notifColor(notif.type);
                        return ListTile(
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 8),
                          leading: Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: iconColor.withValues(alpha: 0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(iconData, color: iconColor, size: 20),
                          ),
                          title: Text(
                            langProvider.translate(notif.titleKey),
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF1A237E),
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 2),
                              Text(
                                langProvider.translate(notif.messageKey),
                                style: GoogleFonts.poppins(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                np.relativeTime(
                                    notif.time, langProvider.currentLanguageCode),
                                style: GoogleFonts.poppins(
                                  fontSize: 11,
                                  color: Colors.grey[400],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _notifIcon(NotificationType type) {
    switch (type) {
      case NotificationType.reservation:
        return Icons.bookmark_added_outlined;
      case NotificationType.promo:
        return Icons.local_offer_outlined;
      case NotificationType.info:
        return Icons.info_outline;
    }
  }

  Color _notifColor(NotificationType type) {
    switch (type) {
      case NotificationType.reservation:
        return const Color(0xFF17C37B);
      case NotificationType.promo:
        return const Color(0xFFFF6B35);
      case NotificationType.info:
        return const Color(0xFF3949AB);
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Shimmer loading skeleton
  // ─────────────────────────────────────────────────────────────────────
  Widget _buildLoadingShimmer() {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: 3,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(right: 16),
          child: ShimmerCard(width: 230, height: 300),
        );
      },
    );
  }
}
