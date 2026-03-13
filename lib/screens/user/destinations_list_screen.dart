import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/index.dart';
import '../../widgets/index.dart';
import '../../constants/constants.dart';

class DestinationsListScreen extends StatefulWidget {
  const DestinationsListScreen({super.key});

  @override
  State<DestinationsListScreen> createState() => _DestinationsListScreenState();
}

class _DestinationsListScreenState extends State<DestinationsListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _viewMode = 'grid'; // grid ou list
  String _selectedCategory = 'Tous';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

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
                  title: Text(
                    langProvider.translate('all_destinations'),
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                actions: [
                  IconButton(
                    icon: Icon(
                      _viewMode == 'grid' ? Icons.view_list : Icons.dashboard,
                      color: Colors.white,
                    ),
                    onPressed: () {
                      setState(() {
                        _viewMode = _viewMode == 'grid' ? 'list' : 'grid';
                      });
                    },
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // Barre de recherche
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: langProvider.translate('search_destination'),
                          hintStyle: GoogleFonts.poppins(color: Colors.grey),
                          prefixIcon: const Icon(Icons.search),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear),
                                  onPressed: () {
                                    _searchController.clear();
                                    destinationProvider.searchDestinations('');
                                  },
                                )
                              : null,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onChanged: (value) {
                          destinationProvider.searchDestinations(value);
                          setState(() {});
                        },
                      ),
                    ),
                    // Filtres
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: ['Tous', ...categories]
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
                                    isSelected: _selectedCategory == category,
                                    onTap: () {
                                      setState(() {
                                        _selectedCategory = category;
                                      });
                                      destinationProvider.filterByCategory(
                                        category,
                                      );
                                    },
                                  ),
                                );
                              },
                            )
                            .toList(),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
              // Liste des destinations
              if (destinationProvider.isLoading)
                const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                )
              else if (destinationProvider.destinations.isEmpty)
                SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.location_off,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          langProvider.translate('no_destination'),
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              else if (_viewMode == 'grid')
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.75,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
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
                      childCount: destinationProvider.destinations.length,
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final destination = destinationProvider.destinations[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: DestinationCard(
                            destination: destination,
                            onTap: () {
                              Navigator.of(context).pushNamed(
                                '/destination-detail',
                                arguments: destination.id,
                              );
                            },
                          ),
                        );
                      },
                      childCount: destinationProvider.destinations.length,
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
