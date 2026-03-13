const String appName = 'TourbF';
const String appSubtitle = 'Découvrez le Burkina Faso';

// Categories
const List<String> categories = ['Culture', 'Aventure', 'Nature'];

// Mock data for demonstrations
const List<Map<String, dynamic>> mockDestinations = [
  {
    'id': '1',
    'name': 'Pics de Sindou',
    'description':
        'Formations rocheuses spectaculaires offrant des panoramas impressionnants. Un incontournable pour les amoureux de la nature.',
    'location': 'Sindou, Burkina Faso',
    'category': 'Nature',
    'rating': 4.7,
    'numberOfReviews': 210,
    'imageUrls': [
      'assets/images/pics_de_sindou.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '2',
    'name': 'Parc W',
    'description':
        'Aventure sauvage avec safari et observation de faune abondante. Une expérience inoubliable.',
    'location': 'Pama, Burkina Faso',
    'category': 'Aventure',
    'rating': 4.9,
    'numberOfReviews': 312,
    'imageUrls': [
      'assets/images/parc_w.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '3',
    'name': 'Parc de Ziniare',
    'description':
        'Espace verdoyant et tranquille parfait pour les randonnées et la détente en plein air.',
    'location': 'Ziniare, Burkina Faso',
    'category': 'Nature',
    'rating': 4.6,
    'numberOfReviews': 98,
    'imageUrls': [
      'assets/images/parc_de_ziniare.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '4',
    'name': 'Lac Tingrela',
    'description':
        'Lac paisible idéal pour les promenades en canoë et l’observation des oiseaux.',
    'location': 'Tingrela, Burkina Faso',
    'category': 'Nature',
    'rating': 4.5,
    'numberOfReviews': 75,
    'imageUrls': [
      'assets/images/lac_tingrela.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '5',
    'name': 'Cour royale de Tiebele',
    'description':
        'Patrimoine culturel où l’architecture traditionnelle est encore préservée. Un voyage dans le temps.',
    'location': 'Tiebele, Burkina Faso',
    'category': 'Culture',
    'rating': 4.4,
    'numberOfReviews': 50,
    'imageUrls': [
      'assets/images/cour_royale_tiebele.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '6',
    'name': 'Musée de Manega',
    'description':
        'Explorez l’histoire locale à travers des objets traditionnels et des expositions sur les communautés.',
    'location': 'Manega, Burkina Faso',
    'category': 'Culture',
    'rating': 4.3,
    'numberOfReviews': 40,
    'imageUrls': [
      'assets/images/musee_manega.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '7',
    'name': 'Musée National',
    'description':
        'Collection riche retraçant les civilisations et l’artisanat du Burkina Faso.',
    'location': 'Ouagadougou, Burkina Faso',
    'category': 'Culture',
    'rating': 4.6,
    'numberOfReviews': 190,
    'imageUrls': [
      'https://images.pexels.com/photos/2444403/pexels-photo-2444403.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '8',
    'name': 'Mare aux caïmans sacré de Sabou',
    'description':
        'Site sacré où vivent des caïmans vénérés. Lieu mythique chargé de traditions.',
    'location': 'Sabou, Burkina Faso',
    'category': 'Culture',
    'rating': 4.2,
    'numberOfReviews': 60,
    'imageUrls': [
      'assets/images/sabou_crocodiles.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
  {
    'id': '9',
    'name': 'Mosquée de Bobo-Dioulasso',
    'description':
        'Monument emblématique de l’architecture soudanaise, lieu de prière et de culture.',
    'location': 'Bobo-Dioulasso, Burkina Faso',
    'category': 'Culture',
    'rating': 4.5,
    'numberOfReviews': 110,
    'imageUrls': [
      'assets/images/bobo_mosque.png',
    ],
    'mapUrl': 'https://maps.google.com',
    'isActive': true,
  },
];

// API endpoints (à adapter selon votre backend)
const String apiBaseUrl = 'https://api.tourismburkina.com';
const String destinationsEndpoint = '/api/destinations';
const String reservationsEndpoint = '/api/reservations';
const String reviewsEndpoint = '/api/reviews';

// Image settings
const Duration imageLoadTimeout = Duration(seconds: 15);
const String defaultPlaceholder =
    'https://via.placeholder.com/400x300?text=Image+Non+Disponible';
