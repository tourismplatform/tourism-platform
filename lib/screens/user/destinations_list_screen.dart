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
      appBar: AppBar(
        title: Text(
          langProvider.translate('all_destinations'),
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      body: Consumer<DestinationProvider>(
        builder: (context, destinationProvider, _) {
          return Column(
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
              // Filtres et Vue
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: ['Tous', ...categories]
                              .map(
                                (category) => Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: CategoryChip(
                                    label: category == 'Tous' ? langProvider.translate('all') : langProvider.translate(category.toLowerCase()),
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
                                ),
                              )
                              .toList(),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        _viewMode == 'grid' ? Icons.view_list : Icons.dashboard,
                      ),
                      onPressed: () {
                        setState(() {
                          _viewMode = _viewMode == 'grid' ? 'list' : 'grid';
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              // Liste des destinations
              Expanded(
                child: destinationProvider.isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : destinationProvider.destinations.isEmpty
                    ? Center(
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
                      )
                    : _viewMode == 'grid'
                    ? GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.75,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 12,
                            ),
                        itemCount: destinationProvider.destinations.length,
                        itemBuilder: (context, index) {
                          final destination =
                              destinationProvider.destinations[index];
                          return DestinationCard(
                            destination: destination,
                            onTap: () {
                              Navigator.of(context).pushNamed(
                                '/destination-detail',
                                arguments: {
                                  'id': destination.id,
                                  'showReservation': false,
                                },
                              );
                            },
                          );
                        },
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: destinationProvider.destinations.length,
                        itemBuilder: (context, index) {
                          final destination =
                              destinationProvider.destinations[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: DestinationCard(
                              destination: destination,
                              onTap: () {
                                Navigator.of(context).pushNamed(
                                  '/destination-detail',
                                  arguments: {
                                    'id': destination.id,
                                    'showReservation': false,
                                  },
                                );
                              },
                            ),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}
