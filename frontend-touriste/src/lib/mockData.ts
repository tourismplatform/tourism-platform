import { Destination, Booking, Review } from '@/types';

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Parc National du W',
    price: 15000,
    rating: 4.8,
    category: 'NATURE',
    location: 'Région Nord',
    cover_image: 'https://picsum.photos/seed/parc/400/300',
    description: 'Un parc magnifique avec une faune exceptionnelle...',
    images: ['https://picsum.photos/seed/parc/800/600', 'https://picsum.photos/seed/parc2/800/600'],
  },
  {
    id: '2',
    name: 'Cascades de Banfora',
    price: 20000,
    rating: 4.5,
    category: 'NATURE',
    location: 'Région Sud-Ouest',
    cover_image: 'https://picsum.photos/seed/banfora/400/300',
    description: 'Les plus belles cascades du Burkina Faso...',
    images: ['https://picsum.photos/seed/banfora/800/600'],
  },
  {
    id: '3',
    name: 'Ruines de Loropéni',
    price: 10000,
    rating: 4.3,
    category: 'CULTURE',
    location: 'Région Sud-Ouest',
    cover_image: 'https://picsum.photos/seed/loropeni/400/300',
    description: "Site classé au patrimoine mondial de l'UNESCO...",
    images: ['https://picsum.photos/seed/loropeni/800/600'],
  },
  {
    id: '4',
    name: 'Dômes de Fabédougou',
    price: 12000,
    rating: 4.6,
    category: 'AVENTURE',
    location: 'Région des Cascades',
    cover_image: 'https://picsum.photos/seed/domes/400/300',
    description: 'Formations rocheuses naturelles spectaculaires...',
    images: ['https://picsum.photos/seed/domes/800/600'],
  },
  {
    id: '5',
    name: 'Lac Tengréla',
    price: 8000,
    rating: 4.4,
    category: 'PLAGE',
    location: 'Région des Cascades',
    cover_image: 'https://picsum.photos/seed/lac/400/300',
    description: 'Un magnifique lac avec des hippopotames et une plage naturelle...',
    images: ['https://picsum.photos/seed/lac/800/600'],
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    user_id: 'u1',
    destination_id: '1',
    rating: 5,
    comment: 'Expérience inoubliable ! La nature est à couper le souffle.',
    user: { name: 'Kouassi Jean' },
    created_at: '2026-02-15',
  },
  {
    id: '2',
    user_id: 'u2',
    destination_id: '1',
    rating: 4,
    comment: 'Très belle destination, guide très professionnel.',
    user: { name: 'Traoré Aminata' },
    created_at: '2026-02-20',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    destination_id: '1',
    user_id: 'me',
    start_date: '2026-04-10',
    end_date: '2026-04-12',
    nb_persons: 2,
    total_price: 30000,
    status: 'CONFIRMED',
    destination: mockDestinations[0],
  },
];