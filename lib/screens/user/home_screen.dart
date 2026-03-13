import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/index.dart';
import '../../widgets/index.dart';
import '../../constants/constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _selectedCategory;

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      drawer: const AppDrawer(),
      body: Consumer<DestinationProvider>(
        builder: (context, destinationProvider, _) {
          return CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 120.0,
                floating: true,
                pinned: true,
                elevation: 0,
                backgroundColor: Theme.of(context).primaryColor,
                flexibleSpace: FlexibleSpaceBar(
                  titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
                  title: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        langProvider.translate('hello'),
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      Text(
                        langProvider.translate('where_to_go'),
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: IconButton(
                      icon: const Icon(Icons.search, color: Colors.white),
                      onPressed: () {
                        // TODO: Implémenter la recherche
                      },
                    ),
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    _buildSectionTitle(langProvider.translate('popular')),
                    SizedBox(
                      height: 280,
                      child: destinationProvider.isLoading
                          ? _buildLoadingShimmer()
                          : ListView.builder(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: destinationProvider.destinations.length,
                              itemBuilder: (context, index) {
                                final destination = destinationProvider.destinations[index];
                                return DestinationCard(
                                  destination: destination,
                                  isCompact: true,
                                  onTap: () {
                                    Navigator.of(context).pushNamed(
                                      '/destination-detail',
                                      arguments: destination.id,
                                    );
                                  },
                                );
                              },
                            ),
                    ),
                    const SizedBox(height: 24),
                    _buildSectionTitle(langProvider.translate('categories')),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: (['Tous', ...categories])
                            .map(
                              (category) {
                                String displayLabel = langProvider.translate('all');
                                if (category != 'Tous') {
                                  displayLabel = langProvider.translate(category == 'Aventure' ? 'adventure' : category.toLowerCase());
                                }
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: CategoryChip(
                                    label: displayLabel,
                                    isSelected: (_selectedCategory == category) || (_selectedCategory == null && category == 'Tous'),
                                    onTap: () {
                                      setState(() {
                                        _selectedCategory = category == 'Tous' ? null : category;
                                      });
                                      destinationProvider.filterByCategory(category);
                                    },
                                  ),
                                );
                              },
                            )
                            .toList(),
                      ),
                    ),
                    const SizedBox(height: 24),
                    if (_selectedCategory != null)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "${langProvider.translate('explore')} ${langProvider.translate(_selectedCategory! == 'Aventure' ? 'adventure' : _selectedCategory!.toLowerCase())}",
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.75,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                              ),
                              itemCount: destinationProvider.destinations.length,
                              itemBuilder: (context, index) {
                                final destination = destinationProvider.destinations[index];
                                return DestinationCard(
                                  destination: destination,
                                  onTap: () {
                                    Navigator.of(context).pushNamed(
                                      '/destination-detail',
                                      arguments: destination.id,
                                    );
                                  },
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Text(
        title,
        style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildLoadingShimmer() {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: 3,
      itemBuilder: (context, index) {
        return const Padding(
          padding: EdgeInsets.only(right: 16),
          child: ShimmerCard(width: 280, height: 280),
        );
      },
    );
  }
}
